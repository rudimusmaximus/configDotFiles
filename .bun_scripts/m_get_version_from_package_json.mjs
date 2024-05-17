import { readFile } from 'fs/promises'; // Use for security-conscious approach

/**
 * Gets the version from package.json
 */
async function getVersion() {
  const packagePath = Bun.resolveSync('./package.json', process.cwd());
  const data = await readFile(packagePath); // securely read the file content
  const version = JSON.parse(data).version;
  return version;
}

export { getVersion };
