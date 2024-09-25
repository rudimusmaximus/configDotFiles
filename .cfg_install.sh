#!/usr/bin/env bash

# e - script stops on error (return != 0)
# u - error if undefined variable
# o pipefail - script fails if one of piped command fails
# x - output each line (debug)
set -euo pipefail

# Error handling function
function error_exit() {
    printf "%s\n" "$1" >&2
    exit 1
}

# Display usage information
function output_help() {
    printf "Usage: %s [options] [--]\n\n" "$0"
    printf "Options:\n"
    printf "  -h       Display this message\n"
    printf "  -v       Display script version\n"
    printf "  -r       Remove existing dotfiles if .cfg is local already. Otherwise, they are backed up during installs.\n"
    printf "  -p       Prepare for reinstall. Remove existing configDotFilesWorktree and .cfg directories.\n"
    printf "           Run without option flag to install\n"
}

# Use 'config' function as a substitute for the 'git' command, scoped to this specific repository setup
function config() {
    /usr/bin/git --git-dir="$HOME/.cfg/" --work-tree="$HOME" "$@"
}

# Backup conflicting dot files
function backup_conflicting_dot_files() {
    local files=("$@")
    printf "Backing up any pre-existing dot files that match the file names we install.\n"
    mkdir -p "$HOME/.cfg-backup"
    for file in "${files[@]}"; do
        if [ -e "$HOME/$file" ]; then  # Check if the file exists
            dir="$(dirname "$file")"
            mkdir -p "$HOME/.cfg-backup/$dir"
            printf " - Moving existing file to %s/.cfg-backup/%s\n" "$HOME" "$file"  # Debug information
            mv "$HOME/$file" "$HOME/.cfg-backup/$file" || error_exit "Failed to move file: $HOME/$file"
        fi
    done
    printf "Clear for checkout.\n"
}

# Install configuration with worktree
function installWithWorktree() {
    printf "rudimusmaximus says hi there,\nCreating bare repo clone of configDotFiles.git into %s/.cfg\n" "$HOME"

    if ! git clone --bare git@github.com:rudimusmaximus/configDotFiles.git "$HOME/.cfg"; then
        error_exit "Error: Failed to clone repository."
    fi

    # Pass list of files in the repository to backup if they already exist
    mapfile -t files_to_backup < <(config ls-tree --full-tree -r --name-only HEAD)
    backup_conflicting_dot_files "${files_to_backup[@]}"

    if config checkout; then
        printf "Checked out config from bare clone of configDotFiles in %s/.cfg\n" "$HOME"
    else
        error_exit "Error: Failed to check out configuration files even after moving existing files."
    fi

    config config status.showUntrackedFiles no
    printf "Turned off showing untracked files\n"

    # Check if .extra file exists before creating one
    if [ -f .extra ]; then
        printf "Found .extra file; leaving it as is.\n"
    else
        if [ -f .extra.template ]; then
            cp .extra.template .extra
            printf "Making starter .extra file; please update with your information. This file is ignored.\n"
        else
            error_exit "Error: Expected .extra.template not found.\n"
        fi
    fi

    printf "Adding worktree in configDotFilesWorktree/\n"
    if config worktree add "$HOME/configDotFilesWorktree"; then
        printf "Successfully added worktree at %s\n" "$HOME/configDotFilesWorktree"
    else
        error_exit "Error: Failed to add worktree at $HOME/configDotFilesWorktree."
    fi

    printf "Please review the readme file - .cfg_README.adoc\n"
    printf "Remember some tools are assumed installed.\n"
    printf "Start a new tab or run 'source %s/.bash_profile' to use the new tools. This is alias 'sb' for future reference.\n" "$HOME"
    printf "Finished.\n"
    printf "Enjoy!\n"
}

# Main function to run the script
function run() {
    local rsync_opts=(-avz --delete)
    cfg_installScriptVersion="2.0.5"
    local flags_passed=false

    # Check if required commands are available first
    command -v rsync >/dev/null 2>&1 || error_exit "rsync is required but it's not installed. Aborting."

    # Parse options using getopts
    while getopts ":hvrp" opt; do
        flags_passed=true  # Mark that at least one flag has been passed
        case $opt in
            h)
                output_help
                exit 0
                ;;
            p)
                printf "Preparing for reinstall. Removing existing configDotFilesWorktree and .cfg directories.\n"
                # Remove the directories if they are present
                [ -d "$HOME/configDotFilesWorktree" ] && rm -rf "$HOME/configDotFilesWorktree"
                [ -d "$HOME/.cfg" ] && rm -rf "$HOME/.cfg"
                ;;
            r)
                if [ ! -d "$HOME/.cfg" ]; then
                    error_exit "Error: .cfg directory does not exist. Cannot remove files."
                fi
                cfgls | xargs rm
                ;;
            v)
                printf " -- Gist Script Version %s\n -- %s installing rudimusmaximus/configDotFiles\n" "$cfg_installScriptVersion" "$0"
                ;;
            *)
                printf "\n  Option does not exist: %s\n\n" "$OPTARG"
                output_help
                exit 1
                ;;
        esac
    done

    shift $((OPTIND - 1))

    # Run installWithWorktree if no flags are passed
    if [ "$flags_passed" = false ]; then
        printf "Running installWithWorktree...\n"
        installWithWorktree "${rsync_opts[@]}"
    else
        printf "Install will not run if flags are passed.\n"
    fi

    printf "Done\n"
    exit 0
}

run "$@"

