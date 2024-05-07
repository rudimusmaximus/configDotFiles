await listKeymapTips();

async function listKeymapTips() {
  console.log('\nSelected Keymap tips for my Neovim setup:\n');
  console.log('COMPLETIONS');
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
  console.log('Tip: as of v0.7.7 RedCrowConsulting/nvim-config use :KeymapTips for similar results\n');
}
