#!/usr/bin/env bash
set -euo pipefail

# Установка: curl -fsSL https://klepa.gpt-chat.by/install.sh | bash
# Всё тело — в функции main, а вызывается она последней строкой: если загрузка скрипта
# оборвётся на середине, bash не выполнит недокачанную часть.
# Совместим с bash 3.2: в macOS команда `| bash` запускает именно его.

checksum() {
  if command -v sha256sum >/dev/null; then
    sha256sum "$1"
  else
    shasum -a 256 "$1"
  fi
}

main() {
  local system arch platform='' name
  system="$(uname -s)"
  arch="$(uname -m)"
  case "$system/$arch" in
    Linux/x86_64) platform=linux-x64 name=Linux ;;
    Darwin/arm64) platform=darwin-arm64 name=macOS ;;
    Darwin/x86_64)
      # Терминал под Rosetta показывает x86_64 и на Mac с M1, поэтому спрашиваем систему.
      if [[ "$(sysctl -n sysctl.proc_translated 2>/dev/null || true)" == 1 ]]; then
        platform=darwin-arm64 name=macOS
      fi
      ;;
    MINGW*|MSYS*|CYGWIN*)
      printf '%s\n' 'Для Windows откройте PowerShell и выполните: irm https://klepa.gpt-chat.by/install.ps1 | iex' >&2
      exit 1
      ;;
  esac
  if [[ -z "$platform" ]]; then
    printf '%s\n' 'Пока поддерживаются Linux x86-64 (Intel или AMD) и Mac на Apple Silicon (M1 и новее).' >&2
    exit 1
  fi
  local command
  for command in curl tar mktemp; do
    command -v "$command" >/dev/null || { printf 'Не найдена команда: %s\n' "$command" >&2; exit 1; }
  done
  if ! command -v sha256sum >/dev/null && ! command -v shasum >/dev/null; then
    printf '%s\n' 'Не найдена команда: sha256sum' >&2
    exit 1
  fi

  local base="${KLEPA_DOWNLOAD_BASE:-https://klepa.gpt-chat.by/cli}"
  tmp="$(mktemp -d)"
  trap 'rm -rf -- "$tmp"' EXIT
  curl -fsSL --retry 3 "$base/$platform/latest" -o "$tmp/latest"
  local digest count
  read -r digest count < "$tmp/latest"
  if [[ ! "$digest" =~ ^[0-9a-f]{64}$ || ! "$count" =~ ^[1-9][0-9]?$ || "$count" -gt 20 ]]; then
    printf '%s\n' 'Некорректное описание установочного архива.' >&2
    exit 1
  fi
  printf 'Скачиваю Клёпу для %s…\n' "$name"
  local i part
  for (( i=0; i<count; i++ )); do
    printf -v part '%02d' "$i"
    curl -fsSL --retry 3 "$base/$platform/$digest/part-$part" -o "$tmp/part-$part"
    cat "$tmp/part-$part" >> "$tmp/klepa.tar.gz"
  done
  local actual
  actual="$(checksum "$tmp/klepa.tar.gz")"
  if [[ "${actual%% *}" != "$digest" ]]; then
    printf '%s\n' 'Архив повреждён. Повторите установку.' >&2
    exit 1
  fi
  mkdir "$tmp/package"
  tar -xzf "$tmp/klepa.tar.gz" -C "$tmp/package"
  unset KLEPA_ENGINE_DIR KLEPA_ENGINE_PATH
  local installer="$tmp/package/scripts/install-unix.sh"
  # Выпуски Linux до появления macOS содержат установщик под прежним именем.
  [[ -f "$installer" ]] || installer="$tmp/package/scripts/install-linux.sh"

  if [[ -n "${KLEPA_INSTALL_PREFIX:-}" ]]; then
    bash "$installer" --prefix "$KLEPA_INSTALL_PREFIX"
    printf 'Для входа выполните: %s/bin/klepa login\nДля запуска выполните: %s/bin/klepa\n' "$KLEPA_INSTALL_PREFIX" "$KLEPA_INSTALL_PREFIX"
    return
  fi

  bash "$installer"
  local rc
  case "${SHELL:-}" in
    */zsh) rc="$HOME/.zshrc" ;;
    # Терминал macOS открывает оболочку входа, а она читает .bash_profile, не .bashrc.
    *) if [[ "$system" == Darwin ]]; then rc="$HOME/.bash_profile"; else rc="$HOME/.bashrc"; fi ;;
  esac
  if [[ ! -f "$rc" ]] || ! grep -Fq '# Klepa CLI: local commands' "$rc"; then
    if ! printf '\n%s\n%s\n' '# Klepa CLI: local commands' 'case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) export PATH="$HOME/.local/bin:$PATH" ;; esac' >> "$rc"; then
      printf 'Не удалось обновить %s. Добавьте ~/.local/bin в PATH вручную.\n' "$rc" >&2
    fi
  fi

  # Скрипт работает в дочернем bash и не может поменять PATH открытого терминала.
  # Если ~/.local/bin в нём уже есть, хватит короткой команды; иначе — полный путь.
  case ":$PATH:" in
    *":$HOME/.local/bin:"*)
      printf '%s\n' 'Готово. Войдите: klepa login' 'Потом запускайте: klepa'
      ;;
    *)
      printf '%s\n' 'Готово. Войдите в этом окне: ~/.local/bin/klepa login' 'В новых окнах терминала команда klepa работает сразу.'
      ;;
  esac
}

main "$@"
