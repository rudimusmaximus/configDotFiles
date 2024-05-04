/**
 * @fileoverview This script establishes or increments the prerelease version in
 * package.json and copies the new version to the clipboard.
 */

import { readFile } from 'fs/promises';
import { $ } from 'zx';
import { copy } from 'copy-paste';

try {
  if (process.argv.length > 3) {
    console.error(
      'Too many arguments. Usage: node establish_or_increment_prerelease_version.mjs [preid] where preid can be empty string'
    );
    process.exit(1);
  }
  // Use an empty string if no argument is provided
  const preid = (process.argv[2] || '');
  const newVersion = await establishOrIncrementPrereleaseVersion(preid);
  await copyToClipboard(`v${newVersion}`);
  console.log(`\n  v${newVersion} Copied to clipboard from updated version in package.json\n`);
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

/**
 * Establishes or increments the prerelease version in package.json.
 * @param {string} preid - The identifier for the prerelease version.
 * @return {string} The new version.
 */
async function establishOrIncrementPrereleaseVersion(preid) {
  try {
    // Run npm version command to establish or increment the prerelease version
    await $`npm --no-git-tag-version version prerelease --preid=${preid}`;
    return JSON.parse(await readFile('./package.json')).version;
  } catch (error) { console.error('Error:', error); process.exit(1); }
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
