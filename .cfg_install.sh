#!/usr/bin/env bash

# e - script stops on error (return != 0)
# u - error if undefined variable
# o pipefail - script fails if one of piped command fails
# x - output each line (debug)
set -euo pipefail

function output_help() {
    printf "Usage: %s [options] [--]\n\n" "$0"
    printf "Options:\n"
    printf "  -h       Display this message\n"
    printf "  -v       Display script version\n"
    printf "  -d       Run rsync with --dry-run for test\n"
    printf "  -p       Prepare for reinstall. Remove existing configDotFilesWorktree and .cfg directories.\n"
    printf "           Run without option flag to install\n"
}
# use 'config` function as a substitute for the `git` command, but scoped to this specific repository setup.
function config {
    /usr/bin/git --git-dir="$HOME"/.cfg/ --work-tree="$HOME" "$@"
}

function backup_conflicting_dot_files() {
    local files=("$@")
    printf "Back up any pre-existing dot files that match the file names we install.\n"
    mkdir -p "$HOME/.cfg-backup"
    for file in "${files[@]}"; do
        if [ -e "$HOME/$file" ]; then  # Check if the file exists
            # echo "Processing file: $file"  # Debug information
            dir="$(dirname "$file")"
            # echo "Creating directory: $HOME/.cfg-backup/$dir"  # Debug information
            mkdir -p "$HOME/.cfg-backup/$dir"
            printf " - Moving existing file to $HOME/.cfg-backup/$file\n"  # Debug information
            mv "$HOME/$file" "$HOME/.cfg-backup/$file" || { echo "Failed to move file: $HOME/$file" >&2; exit 1; }
        # else
        #     echo "File does not exist: $HOME/$file"  # Debug information
        fi
    done
    printf "Clear for checkout.\n"
}

function installWithWorktree() {
    printf "rudimusmaximus says hi there,\nCreating bare repo clone of configDotFiles.git into %s/.cfg\n" "$HOME"

    if ! git clone --bare git@github.com:rudimusmaximus/configDotFiles.git "$HOME"/.cfg; then
        printf "Error: Failed to clone repository.\n"
        exit 1
    fi

    # pass list of files in the repository to backup if they already exist
    files_to_backup=($(config ls-tree --full-tree -r --name-only HEAD))
    backup_conflicting_dot_files "${files_to_backup[@]}"

    if config checkout; then
        printf "Checked out config from bare clone of configDotFiles in %s/.cfg\n" "$HOME"
    else
        printf "Error: Failed to check out configuration files even after moving existing files.\n"
        exit 1
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
            printf "Warning: .extra.template not found.\n"
        fi
    fi

    printf "Adding worktree in configDotFilesWorktree/\n"
    config worktree add "$HOME"/configDotFilesWorktree

    printf "Please review the readme file - .cfg_README.adoc\n"
    printf "Remember some tools are assumed installed.\n"
    printf "Start a new tab or run 'source $HOME/.bash_profile' to use the new tools. This is alias 'sb' for future reference.\n"
    printf "Finished.\n"
    printf "Enjoy!\n"
}

function run() {
    local rsync_opts=(-avz --delete)
    __ScriptVersion="2.0.4"
    local flags_passed=false
    local dry_run=false

    # Check if required commands are available first
    command -v rsync >/dev/null 2>&1 || {
        printf >&2 "rsync is required but it's not installed. Aborting.\n"
        exit 1
    }

    # Parse options using getopts
    while getopts ":hvdp" opt; do
        flags_passed=true  # Mark that at least one flag has been passed
        case $opt in
            h)
                output_help
                exit 0
                ;;
            v)
                printf " -- Gist Script Version %s\n -- %s installing rudimusmaximus/configDotFiles\n" "$__ScriptVersion" "$0"
                ;;
            d)
                dry_run=true
                rsync_opts+=(--dry-run)
                ;;
            p)
                printf "Preparing for reinstall. Removing existing configDotFilesWorktree and .cfg directories.\n"
                # Remove the directories if they are present
                if [ -d "$HOME"/configDotFilesWorktree ]; then
                    rm -rf "$HOME"/configDotFilesWorktree
                fi

                if [ -d "$HOME"/.cfg ]; then
                    rm -rf "$HOME"/.cfg
                fi
                ;;
            *)
                printf "\n  Option does not exist: %s\n\n" "$OPTARG"
                output_help
                exit 1
                ;;
        esac
    done

    shift $((OPTIND - 1))

    # print Dry run if dry_run is true
    if [ "$dry_run" = true ]; then
        printf "Dry run.\n"
    fi
    # Run installWithWorktree if:
    # 1. No flags are passed
    # 2. Only the -d (dry run) flag is passed
    if [ "$flags_passed" = false ] || [ "$dry_run" = true ]; then
        printf "Running installWithWorktree...\n"
        installWithWorktree "${rsync_opts[@]}"
    else
        printf "Flags other than -d were passed, not running installWithWorktree.\n"
    fi

    printf "Done\n"
    exit 0
}

run "$@"

