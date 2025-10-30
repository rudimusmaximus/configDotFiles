#!/usr/bin/env bash
# non-login, interactive shell

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

source "${HOME}/.enable_verbosity_logging_and_terminal_refresh"
verbLog 1 "Entering ~/.bashrc..."

# the things we need every time
declare -a rc_config_files=(
    "${HOME}/.bash_prompt"
    "${HOME}/.aliases"
    "${HOME}/.functions"
    "${HOME}/.keybindings"
    "${HOME}/.path"     # Can be used to extend `$PATH`
    "${HOME}/.exports"  # Set environment variables including default editor
    "${HOME}/.extra"    # Can be used for machine specific or secret settings
    "${HOME}/.multiple_runtime_version_management" # asdf for languages and nvim
    "${HOME}/.greeting" # fastfetch for verbose mode
)

for file in "${rc_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        verbLog 2 "Sourcing ${file} from ~/.bashrc..."
        # shellcheck source=/dev/null
        source "${file}"
    else
        verbLog 2 "Skipped $file (not readable or does not exist)."
    fi
done
unset file

# Initialize tmuxifier layouts if available
if command -v tmuxifier &> /dev/null; then
    eval "$(tmuxifier init -)"
fi

# Enable vi mode for Bash shell to use vi-style keybindings
set -o vi

# enables z as alternative to cd and more (try zi)
eval "$(zoxide init bash)"

verbLog 1 "Finished ~/.bashrc"

# For non-login shells, unset verbosity mode so it's not inherited by child processes
if ! shopt -q login_shell; then
    unset CFG_DOT_FILES_VERBOSE_MODE
fi

