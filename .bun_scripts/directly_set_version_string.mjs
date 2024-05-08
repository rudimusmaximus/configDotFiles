/**
 * @fileoverview This script directly sets the semver string in version of package.json
 * and copies the new version to the clipboard.
 */
import { $ } from 'zx';
import { copy } from 'copy-paste';

try {
  if (process.argv.length === 2) {
    console.error(
      'Usage: v [versionString]'
    );
    process.exit(1);
  }
  const version = (process.argv[2]);
  await $`npm --no-git-tag-version version ${version}`;
  // console.log("npm --no-git-tag-version version ${version}")
  await copyToClipboard(`v${version}`);
  console.log(`\n  v${version} Copied to clipboard from updated version in package.json\n`);
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 */
async function copyToClipboard(text) {
  // Check if copy-paste module is available
  let copyPasteAvailable = false;
  try {
    require('copy-paste');
    copyPasteAvailable = true;
  } catch (error) {
    console.error(
      'Error: copy-paste module not available. Install using npm install copy-paste or yarn add copy-paste.\n',
      'Refer to the repository for more information: https://github.com/sindresorhus/copy-paste'
    );
    process.exit(1); // Exit with error code
  }

  if (copyPasteAvailable) {
    copy(text);
  }
}

