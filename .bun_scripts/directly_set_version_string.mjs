/**
 * @fileoverview This script directly sets the semver string in version of package.json
 * and copies the new version to the clipboard.
 */
import { $ } from 'bun';
import clipboard from 'clipboardy';

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
  await clipboard.write(`v${version}`);
  console.log(`\n  v${version} Copied to clipboard from updated version in package.json\n`);
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
