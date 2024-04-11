/**
 * @fileoverview This script can be used by adding a package script that calls it and
 * therefore can be run on systems with bun.sh installed as 'bun packageScriptName'
 * "scripts": { "semver": "bun ~/.bun_scripts/inject_semantic_version.mjs", ... }
 * bun semver to run inside the project with the package.json script
 * THIS SCRIPT injects the semantic version into a google apps script editor addon
 * see push script in package.json, expects about/a_semantic_version.js to exist
 * in local project and also package.json with version of course
 * @author rudimusmaximus (https://github.com/rudimusmaximus) raul@raulfloresjr.com
 */
import fs from 'fs';
import path from 'path'; // Added for path manipulation

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
console.log(`
Synchronizing package.json's version: "${version}"
 into about/a_semantic_version.js
 as SEMANTIC_VERSION constant.
`);
// Get the script file path (modify as needed)
const fileToUpdate = path.join(process.cwd(), './src/about/', 'a_semantic_version.js');

const code =
`/** @type {string} - semantic version programmatically set to package.json's version */
const SEMANTIC_VERSION = '${version}';
`;

fs.writeFileSync(fileToUpdate, code);

