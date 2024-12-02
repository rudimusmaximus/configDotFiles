#!/usr/bin/env bash
# non-login, interactive shell

source "${HOME}/.verbosity_logging" # provides log and sb functions
log 1 "Entering ~/.bashrc..."

# the things we need every time
declare -a rc_config_files=(
    "${HOME}/.aliases"
    "${HOME}/.functions"
    # "${HOME}/.keybindings"
    "${HOME}/.bash_prompt"
)

for file in "${rc_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        log 1 "Sourcing ${file} from ~/.bashrc..."
        # shellcheck source=/dev/null
        source "${file}"
    else
        log 1 "Skipped $file (not readable or does not exist)."
    fi
    log 1 "Done sourcing ${file}"
done
unset file

# Initialize tmuxifier layouts
eval "$(tmuxifier init -)"

# Enable vi mode for Bash shell to use vi-style keybindings
set -o vi

log 1 "Finished ~/.bashrc"
