# Load the shell dotfiles, and then some:
# * ~/.path can be used to extend `$PATH`.
# * ~/.extra can be used for other settings you don’t want to commit.
for file in ~/.{path,bash_prompt,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;

# Disable iterm integration when running warp as interferes when using PS1 prompt
if [[ $TERM_PROGRAM != "WarpTerminal" ]]; then
test -e "${HOME}/.iterm2_shell_integration.bash" && source "${HOME}/.iterm2_shell_integration.bash"
fi


# display diagnostic as greeting
neofetch;

# EXPORTS for Rust's package manager Cargo: source this file to ensure
# if there's a system-wide Rust installation, the Rust installation managed by rustup
# (in ~/.cargo/bin) will take precedence because items earlier in the PATH are
# checked first when a command is invoked from the terminal.
. "$HOME/.cargo/env"

