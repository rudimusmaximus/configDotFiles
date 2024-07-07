await listKeymapTips();
process.exit(0);

async function listKeymapTips() {
  console.log('Tip: use ":KeymapTipsCodeCompletion" for our nvim completion integrations (inside nvim)');
  console.log('\nFUZZY FIND: Terminal fzf keybindings see https://github.com/junegunn/fzf');
  console.table([
    {
      shell: 'bash',
      Keymap: 'Control + r',
      ['start action']: 'search command history',
      cancel: 'Esc',
      function: '__fzf_history__',
    },
    {
      shell: 'bash',
      Keymap: 'Control + t',
      ['start action']: 'find file',
      cancel: 'Esc',
      function: '__fzf_select__',
    },
    {
      shell: 'bash',
      Keymap: 'Escape  + c',
      ['start action']: 'cd into directory',
      cancel: 'Esc',
      function: '__fzf_cd__',
    },
  ]);
  console.log(`Besides keybindings, you can trigger a completion by pressing tab following either
    someCommand ** + TAB or someCommand startOfSearchString** + TAB
For example try with: export, unset, unalias, ssh, telnet, kill
Or with direcotry commands like:  cd, pushd, rmdir, (remember if you pushd you can pop with popd when done)
    see also https://thevaluable.dev/fzf-shell-integration/\n`);

  console.log('FUZZY w GIT fzf-git.sh keybindings see https://github.com/junegunn/fzf-git.sh');
  console.table([
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'f',
      ['git object']: 'Files',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'b',
      ['git object']: 'Branches',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 't',
      ['git object']: 'Tags',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'r',
      ['git object']: 'Remotes',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'h',
      ['git object']: 'Hashes',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 's',
      ['git object']: 'Stashes',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'l',
      ['git object']: 'reflogs',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'w',
      ['git object']: 'Worktrees',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + g + ',
      ['key']: 'e',
      ['git object']: 'Each ref (git fore-each-ref)',
      cancel: 'Esc',
    },
  ]);
  console.log('\nINSIDE fzf in addition to tab and shit-tab for seletion(s)');
  console.table([
    {
      shell: 'bash',
      Keymap: 'Control + /',
      action: 'change preview window layout',
      cancel: 'Esc',
    },
    {
      shell: 'bash',
      Keymap: 'Control + o',
      action: 'open the object in web browser (in GitHub URL scheme)',
      cancel: 'Esc',
    },
  ]);
}
