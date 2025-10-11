#!/usr/bin/env bash
# login to new session (local or ssh into machine)
# note also sources .bashrc; also, exports are done once here and available thereafter

clear # clear the screen

source "${HOME}/.verbosity_logging_and_refresh_terminal_session" # provides log and refresh_terminal_session functions
verbLog 1 "Entering ~/.bash_profile..."

# The things we need once per session, in preferred order
declare -a profile_config_files=(
    "${HOME}/.bashrc"   # Prompt, alias, functions, keybindings, etc
    "${HOME}/.path"     # Can be used to extend `$PATH`
    "${HOME}/.exports"  # Set environment variables including default editor
    "${HOME}/.extra"    # Can be used for machine specific or secret settings
    "${HOME}/.multiple_runtime_version_management" # asdf for languages and nvim
    "${HOME}/.greeting" # fastfetch for verbose mode
)

for file in "${profile_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        verbLog 2 "Sourcing ${file} from .bash_profile..."
        # shellcheck source=/dev/null
        source "${file}";
    else
        verbLog 2 "Skipped ${file} (not readable or does not exist)."
    fi
done
unset file

verbLog 1 "Finished ~/.bash_profile"

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
