# shellcheck shell=bash
# non-login, interactive shell

declare -a rc_config_files=(
    "${HOME}/.bash_prompt"
    "${HOME}/.aliases"
    "${HOME}/.functions"
)

for file in "${rc_config_files[@]}"; do
    if [ -r "${file}" ] && [ -f "${file}" ]; then
        # shellcheck source=/dev/null
        source "${file}"
    fi
done

# Set up fzf key bindings and fuzzy completion
# see https://github.com/junegunn/fzf
# change for other shells
eval "$(fzf --bash)"

unset file

