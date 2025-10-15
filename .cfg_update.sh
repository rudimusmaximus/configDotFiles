#!/usr/bin/env bash
printf "\n%s\n" "rudimusmaximus/cfgDotFiles Update Script"

# Error handling function
error_exit() {
    printf "%s\n" "$1" >&2
    exit 1
}


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
      CFG_VERSION_MESSAGE="missing package.json"
  fi
fi

# Display usage information
output_help() {
  printf "\nUsage (from home directory in this order for applicable system type):\n"
    printf "  To run locally :  bash .cfg_update.sh [options]\n"
    printf "              or :  cfgUpdateScript [options]\n\n"
    printf "Options:   [System] Action\n"
    printf "  -w       [macOS]  Upgrade homebrew packages\n"
    printf "  -f       [Fedora] Upgrade dnf with refresh\n"
    printf "  -m       [all]    Myrepo updates using local .mrconfig file\n"
    printf "  -a       [all]    Update asdf plugins (then you can refresh-nvim-stable or nighlty)\n"
    printf "  -r       [all]    Refresh nvim nightly\n"
    printf "  -b       [all]    Upgrade bun\n"
    printf "  -n       [all]    Check node LTS versions (installed vs available from plugin)\n"
    printf "  -g       [all]    Set current node LTS version to be global active version\n"
    printf "  -h       [all]    Display this message\n"
    printf "  -v       [all]    Display script version\n\n"
    printf "NOTE: assumes rudimusmaximus/cfgDotFiles is already installed and updated.\n\n"
}

tbd() {
    printf "Option not yet implemented: %s\n" "$1"
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
    # Check if required commands are available first
    # command -v git >/dev/null 2>&1 || error_exit "git is required but it's not installed. Aborting."
    handle_not_a_flag_edge_cases "$@"
    # Parse options using getopts
    while getopts ":wfmarbnghv" opt; do
        case $opt in
            w)
                printf "\n  'brew upgrade'...\n"
                brew upgrade
                ;;
            f)
                printf "\n  'sudo dnf upgrade --refresh -y'...\n"
                sudo dnf upgrade --refresh -y
                ;;
            m)
                if [[ "$(uname)" == "Darwin" ]]; then
                    cores=$(sysctl -n hw.ncpu)
                else
                    cores=$(nproc)
                fi
                printf "\n  'mr -j%s update'\n" "$cores"
                mr -j"$cores" update
                ;;
            a)
                printf "\n  'asdf plugin updtate --all'\n"
                asdf plugin update --all
                ;;
            r)
                print "\n  'refresh-nvim-nightly'\n"
                refresh-nvim-nightly
                ;;

            b)
                printf "\n  'bun upgrade'\n"
                bun upgrade
                ;;
            n)
                printf "\n  'asdf cmd nodjs update-nodebuild > /dev/null 2>&1 && asdf list nodejs && asdf cmd nodejs resolve lts'\n"
                asdf cmd nodejs update-nodebuild > /dev/null 2>&1 && asdf list nodejs && asdf cmd nodejs resolve lts
                ;;
            g)
                printf "\n  'asdf install nodejs $(asdf cmd nodejs resolve lts) && asdf set --home nodejs $(asdf cmd nodejs resolve lts)'\n"
                asdf install nodejs $(asdf cmd nodejs resolve lts) && asdf set --home nodejs $(asdf cmd nodejs resolve lts)
                ;;
            v)
                printf "\n %s\n" "$CFG_VERSION_MESSAGE"
                ;;
            h)
                output_help
                exit 0
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

