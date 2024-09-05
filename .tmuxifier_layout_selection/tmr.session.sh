# Set a custom session root path. Default is `$HOME`.
# Must be called before `initialize_session`.
session_root "${HOME}/project/tmr"

# Create session with specified name if it does not already exist. If no
# argument is given, session name will be based on layout file name.
if initialize_session "tmr"; then

  # Create a new window inline within session layout definition.
  new_window "BATMR Build A Twelve Month Report (cfm refactor)"
  run_cmd "nvim"

  # Load a defined window layout.
  #load_window "example"
  load_window "lazygit"

  # Select the default active window on session creation.
  #select_window 1
  select_window 0

fi

# Finalize session creation and switch/attach to it.
finalize_and_go_to_session

