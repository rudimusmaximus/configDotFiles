#!/usr/bin/env bash
# non-login, interactive shell

source "${HOME}/.verbosity_logging_and_refresh_terminal_session" # provides log and refresh_terminal_session functions
verbLog 1 "Entering ~/.bashrc..."

# the things we need every time
declare -a rc_config_files=(
    "${HOME}/.bash_prompt"
    "${HOME}/.aliases"
    "${HOME}/.functions"
    "${HOME}/.keybindings"
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

# >>> juliaup initialize >>>

# !! Contents within this block are managed by juliaup !!

case ":$PATH:" in
    *:/home/rfjr/.juliaup/bin:*)
        ;;

    *)
        export PATH=/home/rfjr/.juliaup/bin${PATH:+:${PATH}}
        ;;
esac

# <<< juliaup initialize <<<
