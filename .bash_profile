#!/usr/bin/env bash
# login to new session (local or ssh into machine)
# note also sources .bashrc; also, exports are done once here and available thereafter

# The things we need once per session, in preferred order
declare -a profile_config_files=(
    "${HOME}/.verbosity_logging" # provides log and sb functions
    "${HOME}/.path"     # Can be used to extend `$PATH`
    "${HOME}/.exports"  # Set environment variables including default editor
    "${HOME}/.extra"    # Can be used for machine specific or secret settings
    "${HOME}/.bashrc"   # Prompt, alias, functions, keybindings, etc
    "${HOME}/.multiple_runtime_version_management" # asdf for languages and nvim
    "${HOME}/.prerequisite_check" # expected packages or apps TODO grow to simplify new machine setup
    "${HOME}/.greeting" # fastfetch if available
)

for file in "${profile_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        # shellcheck source=/dev/null
        source "${file}";
    fi
done
unset file

