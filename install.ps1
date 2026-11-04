# Klepa CLI for Windows. In PowerShell: irm https://klepa.gpt-chat.by/install.ps1 | iex
# Keep this file ASCII: Windows PowerShell may decode the response as Latin-1. The installer
# with Russian messages is install-windows.ps1; it is fetched as bytes and decoded as UTF-8.
# The whole body is one script block, so a truncated download runs nothing.
& {
  $ErrorActionPreference = 'Stop'
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
  $site = 'https://klepa.gpt-chat.by'
  if ($env:KLEPA_SITE_URL) { $site = $env:KLEPA_SITE_URL.TrimEnd('/') }
  $client = New-Object System.Net.WebClient
  $installer = [Text.Encoding]::UTF8.GetString($client.DownloadData("$site/install-windows.ps1"))
  & ([ScriptBlock]::Create($installer))
}
