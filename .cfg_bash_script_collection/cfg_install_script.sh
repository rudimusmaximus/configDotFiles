#!/usr/bin/env bash
printf "\n%s\n" "rudimusmaximus/cfgDotFiles Install Script"

# Determine script name and version based on whether the script is run locally or remotely
if [[ -f "$0" ]]; then
  # Running locally, use the actual script name
  script_name="$(basename "$0")"
  # Get version from package.json in home directory
  if [[ -f "$HOME/package.json" ]]; then
      CFG_SCRIPT_VERSION=$(jq -r '.version' "$HOME/package.json")
      CFG_VERSION_MESSAGE="-- v${CFG_SCRIPT_VERSION} -- local ~/${script_name}"
  else
      CFG_SCRIPT_VERSION="unknown"
  fi
else
    CFG_SCRIPT_VERSION=$(curl -s "https://raw.githubusercontent.com/rudimusmaximus/configDotFiles/refs/heads/main/package.json" | jq -r '.version')
    CFG_VERSION_MESSAGE="-- v${CFG_SCRIPT_VERSION} -- remote installation (via curl)"
fi

# Error handling function
error_exit() {
    printf "%s\n" "$1" >&2
    exit 1
}

# Display usage information
output_help() {
  printf "\nUsage (from home directory):\n"
    printf "  To run remotely:  bash <(curl -sSf RAW_CODE_URL) [options]\n"
    printf "  To run locally :  bash .cfg_bash_script_collection/cfg_install_script.sh [options]\n\n"
    printf "Options:\n"
    printf "  -b       Basic install of bare repo into .cfg\n"
    printf "  -c       Clone configDotFiles repo into ~/configDotFiles for traditional workflow\n"
    printf "  -h       Display this message\n"
    printf "  -v       Display script version\n"
    printf "  -r       Remove existing dotfiles if .cfg is local - otherwise backed up during installs.\n"
    printf "  -p       Prepare for reinstall. Remove existing cloned directories if present.\n"
    printf "  -q       Check expected prequisites for planned use.\n\n"
    printf "Maintenance after first install (see .cfg_README.adoc):\n"
    printf "  cfgInstallScript       Alias for running script remotely. Just add [options].\n\n"
    printf "NOTE: RAW_CODE_URL above is the GitHub URL to the raw shell script.\n"
    printf "      https://raw.githubusercontent.com/rudimusmaximus/configDotFiles/refs/heads/main/.cfg_bash_script_collection/cfg_install_script.sh\n\n"
    printf "      However, the script uses the SSH URL for cloning which requires github account with a SSH key.\n"
}

# Use 'config' function as a substitute for the 'git' command, scoped to this specific repository setup
config() {
    git --git-dir="$HOME/.cfg/" --work-tree="$HOME" "$@"
}

# Backup conflicting dot files
backup_conflicting_dot_files() {
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
basicBareRepoInstall() {
    printf "rudimusmaximus says hi there,\nCreating bare repo clone of configDotFiles.git into %s/.cfg\n" "$HOME"

    if ! git clone --bare git@github.com:rudimusmaximus/configDotFiles.git "$HOME/.cfg"; then
        error_exit "Error: Failed to clone repository. Ensure that your SSH keys are set up with GitHub."
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

    if [ -f "$HOME/.extra" ]; then
        printf "Found .extra file; leaving it as is.\n"
    else
        if [ -f "$HOME/.extra.template" ]; then
            cp "$HOME/.extra.template" "$HOME/.extra"
            printf "Making starter .extra file; please update with your information. This file is ignored.\n"
        else
            error_exit "Error: Expected .extra.template not found in $HOME.\n"
        fi
    fi

    if [ -f "$HOME/.mrconfig" ]; then
        printf "Found .mrconfig file; leaving it as is.\n"
    else
        if [ -f "$HOME/.mrconfig.template" ]; then
            cp "$HOME/.mrconfig.template" "$HOME/.mrconfig"
            printf "Making starter .mrconfig file; please update with your information. This file is ignored.\n"
        else
            error_exit "Error: Expected .mrconfig.template not found in $HOME.\n"
        fi
    fi

    printf "Please review the readme file - .cfg_README.adoc\n"
    printf "Remember some tools are assumed installed.\n"
    printf "Enter `exec "$SHELL" --login` to use the new tools.\n" "$HOME"
    printf "Finished.\n"
    printf "Enjoy!\n"
}

remove_tracked_files_and_empty_directories_when_done() {
    # Array to store directories to check
    declare -a dirs_to_check

    # Remove tracked files and accumulate directories to check
    config ls-tree --full-tree -r --name-only HEAD | while IFS= read -r file; do
        target="$HOME/$file"
        rm -f "$target"
        # Collect directories for potential cleanup
        dir=$(dirname "$target")
        dirs_to_check+=("$dir")
    done

    # Remove duplicate directories
    dirs_to_check=($(printf "%s\n" "${dirs_to_check[@]}" | sort -u))

    # Remove empty directories, but never delete $HOME
    for dir in "${dirs_to_check[@]}"; do
        if [ -d "$dir" ] && [ "$dir" != "$HOME" ]; then
            # Remove directory if empty, along with parent directories up to $HOME
            rmdir --ignore-fail-on-non-empty -p "$dir" 2>/dev/null || true
        fi
    done
}


# Check for expected prequisites
# apps, files, directories, etc
check_for_expected_prerequisites() {
  clear # clear the screen
  printf "\n%s\n" "[LOG] ✔ Sourcing ~/.prerequisite_check..."
  source "${HOME}/.prerequisite_check"
  printf "%s\n" "[LOG] ✔ Finished ~/.prerequisite_check"
}

check_for_and_remove_expected_repositories() {
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
}

clone_configDotFiles_into_configDotFiles() {
    # Clone configDotFiles repo into $HOME/configDotFiles
    if ! git clone git@github.com:rudimusmaximus/configDotFiles.git "$HOME/configDotFiles"; then
      error_exit "Error: Failed to clone repository. Ensure that your SSH keys are set up with GitHub."
    fi
    printf 'Cloned repository into %s/configDotFiles\n' "$HOME"
}

handle_not_a_flag_edge_cases() {
    # If no flags are passed, suggest -vh
    if [ "$#" -eq 0 ]; then
        error_exit "Error: No options provided; try again with -vh"
    fi
    # Handle lone hyphen error case
    if [ "$1" = "-" ] && [ "$#" -eq 1 ]; then
        error_exit "Error: Incomplete flag (-) provided; please provide a valid flag."
    fi
    # Handle double hyphen (--) with no other valid options
    if [ "$1" = "--" ] && [ "$#" -eq 1 ]; then
        error_exit "Error: Double hyphen (--) provided without valid options."
    fi
    # Handle multiple hyphens (---, ----, etc.)
    if [[ "$1" =~ ^-+$ ]]; then
        error_exit "Error: Invalid option string ($1). Please provide valid flags."
    fi
}

# Main function to run the script
run() {
    clear
    cd "$HOME" || error_exit "Error: Unable to change to home directory."
    # Check if required commands are available first
    command -v git >/dev/null 2>&1 || error_exit "git is required but it's not installed. Aborting."
    handle_not_a_flag_edge_cases "$@"
    # Parse options using getopts
    while getopts ":bchpqrv" opt; do
        case $opt in
            b)
                printf "Running basicBareRepoInstall...\n"
                basicBareRepoInstall
                ;;
            c)
                clone_configDotFiles_into_configDotFiles
                ;;
            h)
                output_help
                exit 0
                ;;
            p)
                printf "Preparing for reinstall. Removing existing configDotFiles and .cfg directories if present.\n"
                check_for_and_remove_expected_repositories
                ;;
            q)
                printf "Checking all expected prequisites for planed use...\n"
                check_for_expected_prerequisites
                ;;
            r)
                printf "Checking for tracked files.\n"
                remove_tracked_files_and_empty_directories_when_done
                printf "Removed tracked files from %s based on existing .cfg.\n" "$HOME"
                ;;
            v)
                printf "\n %s\n" "$CFG_VERSION_MESSAGE"
                ;;
            *)
                printf "\n  Option does not exist: %s\nn" "$OPTARG"
                output_help
                exit 1
                ;;
        esac
    done

    shift $((OPTIND - 1))
    printf "\nSee you next time!\n"
    exit 0
}

run "$@"
