import { copy } from 'copy-paste';
export { copyToClipboard };

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 */
async function copyToClipboard(text) {
  try {
    const copyPasteAvailable = copy ? true : false;
    if (copyPasteAvailable) {
      copy(text);
    }
  } catch (error) {
    console.error(
      'Error: copy-paste module not available. Install using npm install copy-paste or yarn add copy-paste.\n',
      'Refer to the repository for more information: https://github.com/sindresorhus/copy-paste'
    );
    process.exit(1); // Exit with error code
  }
}
