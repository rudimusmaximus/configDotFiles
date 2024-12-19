/**
 * @fileoverview This script can be used by adding a package script that calls it and
 * therefore can be run on systems with bun.sh installed as 'bun packageScriptName'
 * "scripts": { "semver": "bun ~/.bun_scripts/inject_semantic_version.mjs", ... }
 * bun semver to run inside the project with the package.json script
 * THIS SCRIPT injects the semantic version into a google apps script editor addon
 * as an updated or created file ./a_semantic_version.js
 * Requires a package.json with version of course in same directory
 * @author rudimusmaximus (https://github.com/rudimusmaximus) raul@raulfloresjr.com
 */
import fs from 'fs';
import { readFile } from 'fs/promises';

// path to package.json
const packagePath = Bun.resolveSync('./package.json', process.cwd());
// content of package.json
const data = await readFile(packagePath);
const date = new Date();

console.log(
  reflect_semantic_version({
    version: JSON.parse(data).version,
    lastUpdated: date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    lastUpdatedPrecise: date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
  }).toJSON(),
);

process.exit(0);

/**
 * Synchronize package.json's version with a_semantic_version.js usable by local project.
 * @param {object} spec - anonymous object for member destructuring-assignments
 * @param {string} spec.version - version from package.json
 * @param {string} spec.lastUpdated - last updated date in UTC (date only)
 * @param {string} spec.lastUpdatedPrecise - precise last updated timestamp in UTC with time
 * @return {{toJSON: Function,
 * }} Anonymous record type with given type members
 */
function reflect_semantic_version(spec) {
  const {
    version,
    lastUpdated,
    lastUpdatedPrecise,
  } = spec;

  // File path for a_semantic_version.js
  const fileToUpdate = './a_semantic_version.js';

  const code = `/**
 * @file a_semantic_version.js
 * @description Automatically generated file that contains the semantic version of the
 * Google Apps Script Editor add-on. This file is updated as part of the development
 * workflow using a Bun script that synchronizes the version number from package.json
 * and provides a date of change time stamp. These can be used by the add-on.
 * Do not manually edit this file!
 * These values are set by function calls to make the order of where this file appears
 * less important and fully accessible by the project.
 */

/**
 * Make a semVer and last update date available that is in sync with the current
 * package.json. THIS FILE IS GENERATED DO NOT EDIT HERE.
 * @return {{
 * SEMANTIC_VERSION: string, LAST_UPDATED: string, LAST_UPDATED_PRECISE: string,
 * }} Anonymous record type with given type members
 */
function generatedSemVersioning() {
  /**
   * The semantic version of the Google Apps Script Editor add-on, synchronized with the
   * version number specified in package.json. This value is updated automatically by the
   * Bun script as part of the development workflow.
   * @type {string}
   */
  const SEMANTIC_VERSION = '${version}';

  /**
   * The last updated time stamp reflects the day the version was automatically updated.
   * @type {string}
   */
  const LAST_UPDATED = '${lastUpdated}';

  /**
   * The precise last updated time stamp in UTC.
   * @type {string}
   */
  const LAST_UPDATED_PRECISE = '${lastUpdatedPrecise}';

  return Object.freeze({
    SEMANTIC_VERSION: SEMANTIC_VERSION,
    LAST_UPDATED: LAST_UPDATED,
    LAST_UPDATED_PRECISE: LAST_UPDATED_PRECISE,
  });
}

`;

  if (!fs.existsSync(fileToUpdate)) {
    // If file doesn't exist, create it
    fs.writeFileSync(fileToUpdate, code);
    console.log(`File ${fileToUpdate} created and written successfully.`);
  } else {
    // If file exists, update it
    fs.writeFileSync(fileToUpdate, code);
    console.log(`File ${fileToUpdate} updated successfully.`);
  }

  console.log(`Synchronized package.json's version: '${version}'
  into '${fileToUpdate}'
  as SEMANTIC_VERSION, LAST_UPDATED, and LAST_UPDATED_PRECISE constants.
`);

  return Object.freeze({
    toJSON: toJSON,
  });

  /**
   * This returns an object of selected members; it can be called directly or
   * using JSON.stringify on an Object made by invoking this cfoo.
   * @return {object} Snapshot - selected items for logging or debugging
   */
  function toJSON() {
    const snapshot = {
      title: `a selective snapshot of function reflect_semantic_version(spec)`,
      spec,
      toJSON,
    };
    return Object.freeze(snapshot);
  };
};


