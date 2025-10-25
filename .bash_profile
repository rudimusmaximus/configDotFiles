#!/usr/bin/env bash
# login to new session (local or ssh into machine)
# note also sources .bashrc; also, exports are done once here and available thereafter

clear # clear the screen

source "${HOME}/.verbosity_logging_and_refresh_terminal_session" # provides log and refresh_terminal_session functions
verbLog 1 "Entering ~/.bash_profile..."

# The things we need once per session, in preferred order
declare -a profile_config_files=(
    "${HOME}/.path"     # Can be used to extend `$PATH`
    "${HOME}/.exports"  # Set environment variables including default editor
    "${HOME}/.extra"    # Can be used for machine specific or secret settings
    "${HOME}/.multiple_runtime_version_management" # asdf for languages and nvim
    "${HOME}/.greeting" # fastfetch for verbose mode
    "${HOME}/.bashrc"   # Prompt, alias, functions, keybindings, etc
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

# Unset verbosity mode so it's not inherited by child processes
unset CFG_DOT_FILES_VERBOSE_MODE

