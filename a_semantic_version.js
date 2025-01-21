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
   * The last updated time stamp reflects the day the version was automatically updated.
   * @type {string}
   */
  const LAST_UPDATED = 'January 21, 2025';

  /**
   * The precise last updated time stamp in UTC.
   * @type {string}
   */
  const LAST_UPDATED_PRECISE = '2025-01-21 17:29:26 UTC';

  /**
   * The semantic version of the Google Apps Script Editor add-on, synchronized with the
   * version number specified in package.json. This value is updated automatically by the
   * Bun script as part of the development workflow.
   * @type {string}
   */
  const SEMANTIC_VERSION = '0.4.12';

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

