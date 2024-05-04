# shellcheck shell=bash

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

# Display diagnostic as greeting if neofetch is available
command -v neofetch >/dev/null && neofetch;

# Exports for Rust's package manager Cargo
# shellcheck source=/dev/null
source "${HOME}/.cargo/env"

# Ensure sourced in both interactive and non-interactive shells, including SSH sessions
# Prompt, alias, functions
# shellcheck source=/dev/null
source "${HOME}/.bashrc"

# Configure asdf last (see https://asdf-vm.com/guide/getting-started.html)
source "${HOME}/.asdf/asdf.sh"
source "${HOME}/.asdf/completions/asdf.bash"

