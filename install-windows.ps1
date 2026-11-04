# Установщик Клёпы для Windows. Его скачивает и запускает install.ps1:
#   irm https://klepa.gpt-chat.by/install.ps1 | iex
# Скрипт работает в окне пользователя, поэтому ошибки — сообщение и return, а не exit:
# exit закрыл бы PowerShell. Совместим с Windows PowerShell 5.1.
# Всё тело — в функциях, вызов — последней строкой: недокачанный скрипт ничего не выполнит.

function Write-KlepaError([string] $message) {
  Write-Host $message -ForegroundColor Red
}

function Save-KlepaFile([string] $url, [string] $path) {
  for ($attempt = 1; ; $attempt++) {
    try {
      $client = New-Object System.Net.WebClient
      if ($client.Proxy) { $client.Proxy.Credentials = [Net.CredentialCache]::DefaultNetworkCredentials }
      $client.DownloadFile($url, $path)
      return
    } catch {
      if ($attempt -ge 3) { throw }
      Start-Sleep -Seconds 2
    }
  }
}

# Скачивает части выпуска, склеивает их и сверяет SHA-256. Возвращает хеш архива.
function Get-KlepaRelease([string] $base, [string] $archive) {
  $latest = Join-Path (Split-Path -Parent $archive) 'latest'
  Save-KlepaFile "$base/windows-x64/latest" $latest
  $fields = @(([IO.File]::ReadAllText($latest)).Trim() -split '\s+')
  if ($fields.Count -ne 2 -or $fields[0] -notmatch '^[0-9a-f]{64}$' -or $fields[1] -notmatch '^[1-9][0-9]?$' -or [int] $fields[1] -gt 20) {
    throw 'Некорректное описание установочного архива.'
  }
  $digest = $fields[0]
  $count = [int] $fields[1]
  Write-Host 'Скачиваю Клёпу для Windows…'
  $output = [IO.File]::Create($archive)
  try {
    for ($i = 0; $i -lt $count; $i++) {
      $name = 'part-{0:D2}' -f $i
      $part = Join-Path (Split-Path -Parent $archive) $name
      Save-KlepaFile "$base/windows-x64/$digest/$name" $part
      $source = [IO.File]::OpenRead($part)
      try { $source.CopyTo($output) } finally { $source.Dispose() }
    }
  } finally {
    $output.Dispose()
  }
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $archive).Hash.ToLowerInvariant()
  if ($actual -ne $digest) { throw 'Архив повреждён. Повторите установку.' }
  return $digest
}

# Раскладывает выпуск в versions\<хеш> и переключает на него bin\klepa.cmd.
# Каждый выпуск — в своей папке: Windows не даёт заменить kilo.exe, пока Клёпа запущена.
function Install-KlepaFiles([string] $archive, [string] $digest, [string] $root) {
  $versions = Join-Path $root 'versions'
  $target = Join-Path $versions $digest
  New-Item -ItemType Directory -Force -Path $versions | Out-Null
  if (-not (Test-Path -LiteralPath (Join-Path $target 'libexec\kilo.exe'))) {
    if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Recurse -Force }
    $staging = Join-Path $versions ('.new-' + [Guid]::NewGuid().ToString('N'))
    Expand-Archive -LiteralPath $archive -DestinationPath $staging
    Rename-Item -LiteralPath $staging -NewName $digest
  }

  $bin = Join-Path $root 'bin'
  New-Item -ItemType Directory -Force -Path $bin | Out-Null
  # Без call: управление уходит во внутренний файл и в этот cmd уже не возвращается,
  # поэтому его можно переписывать, даже пока Клёпа запущена.
  $shim = "@echo off`r`n""%~dp0..\versions\$digest\bin\klepa.cmd"" %*`r`n"
  [IO.File]::WriteAllText((Join-Path $bin 'klepa.cmd'), $shim, [Text.Encoding]::ASCII)

  foreach ($old in @(Get-ChildItem -LiteralPath $versions -Directory)) {
    if ($old.Name -eq $digest) { continue }
    try {
      # Сначала kilo.exe: если старая Клёпа ещё работает, файл занят, и папку не трогаем,
      # чтобы не удалить у работающей Клёпы её файлы. Её уберёт следующая установка.
      $engine = Join-Path $old.FullName 'libexec\kilo.exe'
      if (Test-Path -LiteralPath $engine) { Remove-Item -LiteralPath $engine -Force }
      Remove-Item -LiteralPath $old.FullName -Recurse -Force
    } catch {
      Write-Verbose "Старая версия занята: $($old.FullName)"
    }
  }
  return $bin
}

# Добавляет папку в PATH пользователя и текущего окна. Значение PATH читается и пишется
# без раскрытия %ПЕРЕМЕННЫХ%: иначе чужие записи вида %USERPROFILE%\... перестали бы
# обновляться. Тип REG_EXPAND_SZ сохраняется.
function Add-KlepaPath([string] $bin) {
  $key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Environment', $true)
  try {
    $raw = [string] $key.GetValue('Path', '', [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
    $entries = @($raw -split ';' | Where-Object { $_ })
    $known = @($entries | Where-Object { [Environment]::ExpandEnvironmentVariables($_).TrimEnd('\') -ieq $bin.TrimEnd('\') })
    if ($known.Count -eq 0) {
      $key.SetValue('Path', (($entries + $bin) -join ';'), [Microsoft.Win32.RegistryValueKind]::ExpandString)
      # SetEnvironmentVariable для пользователя рассылает WM_SETTINGCHANGE: новые окна,
      # открытые из меню «Пуск», увидят обновлённый PATH без выхода из системы.
      [Environment]::SetEnvironmentVariable('KLEPA_INSTALLER', '1', 'User')
      [Environment]::SetEnvironmentVariable('KLEPA_INSTALLER', $null, 'User')
    }
  } finally {
    $key.Close()
  }
  $inSession = @($env:Path -split ';' | Where-Object { $_.TrimEnd('\') -ieq $bin.TrimEnd('\') })
  if ($inSession.Count -eq 0) { $env:Path = "$bin;$env:Path" }
}

function Install-Klepa {
  $ErrorActionPreference = 'Stop'
  $ProgressPreference = 'SilentlyContinue'
  if ($PSVersionTable.PSVersion.Major -ge 6 -and -not $IsWindows) {
    Write-KlepaError 'Этот установщик — для Windows. На Linux и macOS выполните: curl -fsSL https://klepa.gpt-chat.by/install.sh | bash'
    return
  }
  $arch = $env:PROCESSOR_ARCHITEW6432
  if (-not $arch) { $arch = $env:PROCESSOR_ARCHITECTURE }
  if ($arch -ne 'AMD64') {
    Write-KlepaError 'Пока поддерживается только 64-битная Windows на Intel или AMD.'
    return
  }
  if ([Environment]::OSVersion.Version.Major -lt 10) {
    Write-KlepaError 'Нужна Windows 10 или новее.'
    return
  }
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

  $base = 'https://klepa.gpt-chat.by/cli'
  if ($env:KLEPA_DOWNLOAD_BASE) { $base = $env:KLEPA_DOWNLOAD_BASE.TrimEnd('/') }
  $root = Join-Path $env:LOCALAPPDATA 'Programs\Klepa'
  if ($env:KLEPA_INSTALL_ROOT) { $root = $env:KLEPA_INSTALL_ROOT }

  $tmp = Join-Path ([IO.Path]::GetTempPath()) ('klepa-' + [Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $tmp | Out-Null
  try {
    $archive = Join-Path $tmp 'klepa.zip'
    $digest = Get-KlepaRelease $base $archive
    $bin = Install-KlepaFiles $archive $digest $root
    if ($env:KLEPA_INSTALL_ROOT) {
      Write-Host 'Клёпа установлена.' -ForegroundColor Green
      Write-Host "Для входа выполните: $bin\klepa.cmd login"
      return
    }
    Add-KlepaPath $bin
    Write-Host 'Клёпа установлена.' -ForegroundColor Green
    Write-Host 'Войдите: klepa login'
    Write-Host 'Потом запускайте: klepa'
    Write-Host 'В других уже открытых окнах команда klepa появится после их перезапуска.'
  } catch {
    Write-KlepaError ('Не удалось установить Клёпу: ' + $_.Exception.Message)
  } finally {
    Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
  }
}

Install-Klepa
