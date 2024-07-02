await listKeymapTips();
process.exit(0);

async function listKeymapTips() {
  console.log('\nSelected Keymap tips for my Neovim setup:\n');
  console.log('Tip: as of v0.7.7 RedCrowConsulting/nvim-config use :KeymapTips for similar results\n');
  console.log('COMPLETIONS inside nvim');
  console.table([
    {
      Engine: 'nvim-cmp',
      Keymap: 'Control +',
      ['suggest']: 'space',
      ['shh']: 'e',
      next: 'n',
      previous: 'p',
      ['ok']: 'y',
      ['scr docs -']: 'd',
      ['scr docs +']: 'f',
    },
    {
      Engine: 'Codeium',
      Keymap: 'Control +',
      ['suggest']: '/',
      ['shh']: 'x',
      next: ';',
      previous: ',',
      ['ok']: 'k',
      ['scr docs -']: 'n/a',
      ['scr docs +']: 'n/a',
    },
  ]);
  console.log('\n');
  console.log('Terminal fzf keybindings');
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
  console.log(`Tip: OR trigger a completion by pressing tab following either $:
     someCommand ** + TAB
     someCommand startOfSearchString** + TAB
select with tab unselect with shift-tab (one or more based on command)
try with anything including: export, unset, unalias, ssh, telnet, kill
and direcotry commands: cd, pushd, rmdir
remember if you pushd you can pop with popd when you are done

see also: https://github.com/junegunn/fzf
and https://thevaluable.dev/fzf-shell-integration/\n`);
}
