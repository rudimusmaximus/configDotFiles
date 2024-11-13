#!/usr/bin/env bash
# non-login, interactive shell

# the things we need every time
declare -a rc_config_files=(
    "${HOME}/.bash_prompt"
    "${HOME}/.aliases"
    "${HOME}/.functions"
    "${HOME}/.keybindings"
)

for file in "${rc_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        # shellcheck source=/dev/null
        source "${file}"
    fi
done
unset file

# Initialize tmuxifier layouts
eval "$(tmuxifier init -)"

# Enable vi mode for Bash shell to use vi-style keybindings
set -o vi

