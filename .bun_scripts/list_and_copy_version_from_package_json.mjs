/**
 * @fileoverview This script lists and copies the current package version to the clipboard.
 */

import { readFile } from 'fs/promises';
import { copy } from 'copy-paste';

listAndCopyPackageVersion();

/**
 * Lists and copies the current package version to the clipboard.
 */
async function listAndCopyPackageVersion() {
  let packageData;
  try {
    // Read package.json data
    packageData = JSON.parse(await readFile('./package.json'));

    const version = packageData.version;

    await copyToClipboard(`v${version}`);
    console.log(`\n  v${version} from package.json copied to clipboard.\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code
  }
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
    await copy(text);
  }
}

