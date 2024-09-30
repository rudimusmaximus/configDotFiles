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
    printf "  -b       Basic install of bare repo into .cfg\n"
    printf "  -c       Clone configDotFiles repo into ~/configDotFiles for traditional workflow\n"
    printf "  -h       Display this message\n"
    printf "  -v       Display script version\n"
    printf "  -r       Remove existing dotfiles if .cfg is local - otherwise backed up during installs.\n"
    printf "  -p       Prepare for reinstall. Remove existing cloned directories if present.\n"
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

# Install repositories
function basicBareRepoInstall() {
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

    printf "Please review the readme file - .cfg_README.adoc\n"
    printf "Remember some tools are assumed installed.\n"
    printf "Start a new tab or run 'source %s/.bash_profile' to use the new tools. This is alias 'sb' for future reference.\n" "$HOME"
    printf "Finished.\n"
    printf "Enjoy!\n"
}

# Main function to run the script
function run() {
    local rsync_opts=(-avz --delete)
    cfg_installScriptVersion="2.0.9"

    # Check if required commands are available first
    command -v rsync >/dev/null 2>&1 || error_exit "rsync is required but it's not installed. Aborting."

    # Parse options using getopts
    while getopts ":bchprv" opt; do
        case $opt in
            b)
                printf "Running basicBareRepoInstall...\n"
                basicBareRepoInstall "${rsync_opts[@]}"
                ;;
            c)
                if ! git clone git@github.com:rudimusmaximus/configDotFiles.git "$HOME/configDotFiles"; then
                  error_exit "Error: Failed to clone repository."
                fi
                printf 'Cloned repository into %s/configDotFiles\n' "$HOME"
                ;;
            h)
                output_help
                exit 0
                ;;
            p)
                printf "Preparing for reinstall. Removing existing configDotFiles and .cfg directories if present.\n"
                local something_was_removed=false

                # Remove the directories if they are present and print a message
                if [ -d "$HOME/configDotFiles" ]; then
                    rm -rf "$HOME/configDotFiles"
                    something_was_removed=true
                    printf "configDotFiles/ was removed.\n"
                fi

                if [ -d "$HOME/.cfg" ]; then
                    rm -rf "$HOME/.cfg"
                    something_was_removed=true
                    printf ".cfg/ was removed.\n"
                fi

                if [ "$something_was_removed" = false ]; then
                    printf "Nothing removed; target directories were not present.\n"
                fi
                ;;
            r)
                printf "Checking for tracked files.\n"
                if [ ! -d "$HOME/.cfg" ]; then
                    error_exit "Error: .cfg directory does not exist. Cannot remove files."
                fi
                config ls-tree --full-tree -r --name-only HEAD | xargs rm
                printf "Removed tracked files from %s based on existing .cfg.\n" "{$HOME}"
                ;;
            v)
                printf " -- Gist Script Version %s -- %s installing rudimusmaximus/configDotFiles\n" "$cfg_installScriptVersion" "$0"
                ;;
            *)
                printf "\n  Option does not exist: %s\n\n" "$OPTARG"
                output_help
                exit 1
                ;;
        esac
    done

    shift $((OPTIND - 1))

    printf "See you next time!\n"
    exit 0
}

run "$@"

