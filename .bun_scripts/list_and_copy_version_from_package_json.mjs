/**
 * @fileoverview This script lists and copies the current package version to the clipboard.
 */

import clipboard from 'clipboardy';
import { getVersion } from './m_get_version_from_package_json.mjs';

listAndCopyPackageVersion();

async function listAndCopyPackageVersion() {
  try {
    await clipboard.write(`v${await getVersion()}`);
    console.log(`\n  v${await getVersion()} from package.json copied to clipboard.\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit with error code
  }
}
