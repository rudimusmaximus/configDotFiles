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
if command -v fzf > /dev/null 2>&1; then
    eval "$(fzf --bash)"
fi

# Check if fzf-git.sh exists and source it, otherwise prompt the user to clone the repository
if [ -f "${HOME}/fzf-git.sh/fzf-git.sh" ]; then
    source "${HOME}/fzf-git.sh/fzf-git.sh"
else
    echo "fzf-git.sh not found. Please clone the repository and re-source your .bash_profile to enable better git integration with fzf. see repo for additional key commands"
    echo "Run the following commands:"
    echo "git clone https://github.com/junegunn/fzf-git.sh.git ~/fzf-git.sh"
    echo "source ~/.bash_profile"
fi

unset file

