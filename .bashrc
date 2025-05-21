#!/usr/bin/env bash
# non-login, interactive shell

source "${HOME}/.verbosity_logging_and_refresh_terminal_session" # provides log and refresh_terminal_session functions
verbLog 1 "Entering ~/.bashrc..."

# the things we need every time
declare -a rc_config_files=(
    "${HOME}/.aliases"
    "${HOME}/.functions"
    "${HOME}/.keybindings"
    "${HOME}/.bash_prompt"
)

for file in "${rc_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        verbLog 1 "Sourcing ${file} from ~/.bashrc..."
        # shellcheck source=/dev/null
        source "${file}"
    else
        verbLog 1 "Skipped $file (not readable or does not exist)."
    fi
    verbLog 1 "Done."
done
unset file

# Initialize tmuxifier layouts if available
if command -v tmuxifier &> /dev/null; then
    eval "$(tmuxifier init -)"
fi

# Enable vi mode for Bash shell to use vi-style keybindings
set -o vi

verbLog 1 "Finished ~/.bashrc"
