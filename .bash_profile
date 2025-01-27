#!/usr/bin/env bash
# login to new session (local or ssh into machine)
# note also sources .bashrc; also, exports are done once here and available thereafter

# Only clear if verbose mode is off
if [ "${CFG_DOT_FILES_VERBOSE_MODE:-false}" != true ]; then
  clear # clear the screen
fi

source "${HOME}/.verbosity_logging" # provides log and sb functions
verbLog 1 "Entering ~/.bash_profile..."

# The things we need once per session, in preferred order
declare -a profile_config_files=(
    "${HOME}/.path"     # Can be used to extend `$PATH`
    "${HOME}/.exports"  # Set environment variables including default editor
    "${HOME}/.extra"    # Can be used for machine specific or secret settings
    "${HOME}/.bashrc"   # Prompt, alias, functions, keybindings, etc
    "${HOME}/.multiple_runtime_version_management" # asdf for languages and nvim
    "${HOME}/.greeting" # fastfetch if available
)

for file in "${profile_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        verbLog 1 "Sourcing ${file} from .bash_profile..."
        # shellcheck source=/dev/null
        source "${file}";
    else
        verbLog 1 "Skipped ${file} (not readable or does not exist)."
    fi
    verbLog 1 "Done."
done
unset file

verbLog 1 "Finished ~/.bash_profile"
