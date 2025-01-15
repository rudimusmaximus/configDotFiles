/**
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
  const SEMANTIC_VERSION = '0.4.8';

  /**
   * The last updated time stamp reflects the day the version was automatically updated.
   * @type {string}
   */
  const LAST_UPDATED = 'January 15, 2025';

  /**
   * The precise last updated time stamp in UTC.
   * @type {string}
   */
  const LAST_UPDATED_PRECISE = '2025-01-15 05:10:17 UTC';

  return Object.freeze({
    SEMANTIC_VERSION: SEMANTIC_VERSION,
    LAST_UPDATED: LAST_UPDATED,
    LAST_UPDATED_PRECISE: LAST_UPDATED_PRECISE,
  });
}

/**
 * Determines if the current environment is Google Apps Script.
 * This function checks for the existence of the 'Session' object and its 'getActiveUser'
 * method, which are unique to the Google Apps Script environment. This helps in
 * conditionally executing code based on the run time environment.
 */
if (typeof Session === 'undefined' || typeof Session.getActiveUser !== 'function') {
  console.log(generatedSemVersioning());
}

