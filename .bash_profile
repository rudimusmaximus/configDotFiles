#!/usr/bin/env bash
clear # clear the screen

source "${HOME}/.enable_verbosity_logging_and_terminal_refresh"
verbLog 1 "Entering ~/.bash_profile..."
  verbLog 2 "Sourcing .bashrc so that all login shells have the same configuration."
  if [ -f "${HOME}/.bashrc" ]; then
    source "${HOME}/.bashrc"
  fi
verbLog 1 "Finished ~/.bash_profile"

# Unset verbosity mode so it's not inherited by child processes
unset CFG_DOT_FILES_VERBOSE_MODE

