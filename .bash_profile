#!/usr/bin/env bash

# * ~/.path can be used to extend `$PATH`.
# * ~/.extra can be used for other settings you don’t want to commit.
declare -a profile_config_files=(
    "${HOME}/.path"
    "${HOME}/.extra"
    "${HOME}/.exports"
)

for file in "${profile_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        # shellcheck source=/dev/null
        source "${file}";
    fi
done
unset file

# shellcheck source=/dev/null
if [[ $TERM_PROGRAM == "iTerm.app" ]]; then
    test -e "${HOME}/.iterm2_shell_integration.bash" &&
        source "${HOME}/.iterm2_shell_integration.bash"
fi

# Display diagnostic as greeting if available
# Check if fastfetch is available
if command -v fastfetch >/dev/null; then
    fastfetch;
else
    printf "\nFastfetch is not installed. https://github.com/fastfetch-cli/fastfetch\nPlease install to start with diagnostics.\n"
fi

# asdf settings
# Configure asdf last (see https://asdf-vm.com/guide/getting-started.html)
# User urls when installing plugins see https://github.com/asdf-vm/asdf-plugins?tab=readme-ov-file#plugin-list
# Check if asdf is cloned in $HOME/.asdf
if [ -d "$HOME/.asdf" ]; then
  # Initialize asdf
  # shellcheck source=/dev/null
  source "$HOME/.asdf/asdf.sh"
  # shellcheck source=/dev/null
  source "$HOME/.asdf/completions/asdf.bash"
  
  # Set GOROOT for go (golang installed by asdf used by nvim)
  if asdf where golang >/dev/null 2>&1; then
    export GOROOT="$(asdf where golang)"
  else
    printf "golang is not installed with asdf.\n"
  fi
else
  # Provide message for installing asdf properly
  printf "asdf is not installed; you should clone the repo as it has a command for updates.\n"
  printf "On updates, run 'exec \$SHELL' or restart your shell.\n"
  printf "Visit https://asdf-vm.com/guide/getting-started.html#official-download.\n"
fi

# Ensure sourced in both interactive and non-interactive shells, including SSH sessions
# Prompt, alias, functions
# shellcheck source=/dev/null
source "${HOME}/.bashrc"

eval "$(tmuxifier init -)"

