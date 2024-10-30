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
import { readFile } from 'fs/promises';

const packagePath = Bun.resolveSync('./package.json', process.cwd());
const data = await readFile(packagePath);
const version = JSON.parse(data).version;
const date = new Date();

// Last updated date in UTC (date only)
const lastUpdated = date.toLocaleDateString('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// Precise last updated timestamp in UTC with time, keep the z
const lastUpdatedPrecise = date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');

const fileToUpdate = Bun.resolveSync('./src/about/a_semantic_version.js', process.cwd());
console.log(`
Synchronized package.json's version: '${version}'
 with last updated        : '${lastUpdated}'
 and  last updated precise: '${lastUpdatedPrecise}'
 into '${fileToUpdate}'
 as SEMANTIC_VERSION, LAST_UPDATED, and LAST_UPDATED_PRECISE constants.
`);

const code =
  `/**
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

`

fs.writeFileSync(fileToUpdate, code);
process.exit(0);

