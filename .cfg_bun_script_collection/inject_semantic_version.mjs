/**
 * @fileoverview This script can be used by adding a package script that calls it and
 * therefore can be run on systems with bun.sh installed as 'bun packageScriptName'
 * "scripts": { "semver": "bun ~/.cfg_bun_script_collection/inject_semantic_version.mjs", ... }
 * bun semver to run inside the project with the package.json script
 * THIS SCRIPT injects the semantic version into a google apps script editor addon
 * as an updated or created file ./a_semantic_version.js
 * Requires a package.json with version of course in same directory
 * @author rudimusmaximus (https://github.com/rudimusmaximus) raul@raulfloresjr.com
 */

/** @type {import('bun-types').Bun } */

try {
  const packagePath = './package.json';
  // contents of package.json
  const data = await Bun.file(packagePath).text();
  const date = new Date();

  const betterSemanticVersion = await reflect_semantic_version({
    version: JSON.parse(data).version,
    lastUpdated: date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    lastUpdatedPrecise: date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
    fileToUpdate: './a_semantic_version.js',
  });

  console.log(betterSemanticVersion.toJSON());

} catch (error) {
  console.error('An error occurred:', error);
  console.error(error.stack);
}

/**
 * Synchronize package.json's version with a_semantic_version.js usable by local project.
 * @param {object} spec - anonymous object for member destructuring-assignments
 * @param {string} spec.version - version from package.json
 * @param {string} spec.lastUpdated - last updated date in UTC (date only)
 * @param {string} spec.lastUpdatedPrecise - precise last updated timestamp in UTC with time
 * @param {string} spec.fileToUpdate - path to file to update
 * @return {Promise<{toJSON: Function}>} A Promise that resolves to an object with a toJSON method.
 */
async function reflect_semantic_version(spec) {
  const {
    version,
    lastUpdated,
    lastUpdatedPrecise,
    fileToUpdate,
  } = spec;

  const code = defineSemanticCode().semanticCode;
  const fileExists = await Bun.file(fileToUpdate).exists();

  // Write to a_semantic_version.js using Bun's write function
  await Bun.write(fileToUpdate, code);
  console.log(`File ${fileToUpdate} has been ${fileExists ? 'updated' : 'created'} successfully.`);

  return Promise.resolve(Object.freeze({
    toJSON: toJSON,
  }));

  function defineSemanticCode() {
    const code = (`/**
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
   * The last updated time stamp reflects the day the version was automatically updated.
   * @type {string}
   */
  const LAST_UPDATED = '${lastUpdated}';

  /**
   * The precise last updated time stamp in UTC.
   * @type {string}
   */
  const LAST_UPDATED_PRECISE = '${lastUpdatedPrecise}';

  /**
   * The semantic version of the Google Apps Script Editor add-on, synchronized with the
   * version number specified in package.json. This value is updated automatically by the
   * Bun script as part of the development workflow.
   * @type {string}
   */
  const SEMANTIC_VERSION = '${version}';

  return Object.freeze({
    LAST_UPDATED,
    LAST_UPDATED_PRECISE,
    SEMANTIC_VERSION,
  });
}

/**
 * Determines if the current environment is Google Apps Script.
 * This function checks for the existence of the 'PropertiesService' object
 * available in the Google Apps Script environment. This helps in
 * conditionally executing code based on the run time environment.
 */
if (typeof PropertiesService === 'undefined') console.log(generatedSemVersioning());

`);
    return Object.freeze({
      semanticCode: code,
    });
  }

  /**
   * This returns an object of selected members; it can be called directly or
   * using JSON.stringify on an Object made by invoking this cfoo.
   * @return {object} Snapshot - selected items for logging or debugging
   */
  function toJSON() {
    const snapshot = {
      title: `a selective snapshot of reflect_semantic_version(spec)`,
      spec,
      toJSON,
    };
    return Object.freeze(snapshot);
  };
};

