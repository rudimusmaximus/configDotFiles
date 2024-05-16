import { readFile } from 'fs/promises'; // Use for security-conscious approach

async function get_version_from_package_json() {
  const packagePath = Bun.resolveSync('./package.json', process.cwd());
  const data = await readFile(packagePath); // securely read the file content
  const version = JSON.parse(data).version;
  return version;
}

const getVersion = get_version_from_package_json;

export { getVersion };
