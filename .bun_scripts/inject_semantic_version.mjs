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
import path from 'path';

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
const lastUpdated = new Date().toLocaleDateString('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

// Get the script file path (modify as needed)
const fileToUpdate = path.join(process.cwd(), './src/about/', 'a_semantic_version.js');

console.log(`
Synchronizing package.json's version: "${version}"
 and last updated timestamp: "${lastUpdated}"
 into "${fileToUpdate}"
 as SEMANTIC_VERSION and LAST_UPDATED constants.

`);

const code =
`/**
 * @file a_semantic_version.js
 * @description Automatically generated file that contains the semantic version of the
 * Google Apps Script Editor add-on. This file is updated as part of the development
 * workflow using a Bun script that synchronizes the version number from package.json
 * and provides a day of change timestamp. These can be used by the add-on.
 * Do not manually edit this file!
 */

/**
 * The semantic version of the Google Apps Script Editor add-on, synchronized with the
 * version number specified in package.json. This value is updated automatically by the
 * Bun script as part of the development workflow.
 * @type {string}
 */
const SEMANTIC_VERSION = (function() {
  const version = '${version}';
  return version;
})();

/**
 * The last updated timestamp reflects the day the version was automatically updated.
 * @type {string}
 */
const LAST_UPDATED = (function() {
  const lastUpdated = '${lastUpdated}';
  return lastUpdated;
})();
`;

fs.writeFileSync(fileToUpdate, code);

