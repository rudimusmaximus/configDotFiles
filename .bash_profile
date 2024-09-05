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

# Display diagnostic as greeting if available
# Check if fastfetch is available
if command -v fastfetch >/dev/null; then
    fastfetch;
else
    printf "\nFastfetch is not installed. https://github.com/fastfetch-cli/fastfetch\nPlease install to start with diagnostics.\n"
fi

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

eval "$(tmuxifier init -)"

export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
