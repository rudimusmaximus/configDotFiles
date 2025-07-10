/**
 * @fileoverview This script automates the initialization of a new project repository.
 * It performs the following actions:
 * 1. Initializes a Git repository with a 'main' branch.
 * 2. Configures Git Flow to use 'main' as the production branch.
 * 3. Initializes Git Flow with the specified configuration.
 * 4. Starts a new feature branch named 'baseline'.
 * 5. Initializes a Bun project.
 * 6. Modifies the generated package.json to set the version to "0.1.0".
 * 7. Sorts the package.json file if 'sort-package-json' is installed.
 *
 * @usage
 * bun run ~/.bun_scripts/initialize_git_and_git_flow_with_bun.mjs
 */

import { file, write, which } from 'bun';
import { $ } from 'bun';


/**
 * From a named folder, starts a project git and git flow.
 * @param {object} spec - anonymous object for member destructuring-assignments
 * @param {string} spec.featureBranchName - what to call a new git flow feature branch
 * @param {string} spec.primaryBranchName - old school was master, set to 'main'
 * @param {string} spec.currentVersion - current project version
 * @param {string} spec.packageJsonPath - path to package.json
 * @returns {Promise<{toJSON: function(): object}>} A promise that resolves to an object with a toJSON method.
 */
async function initializeGitAndGitFlow(spec) {

  const {
    primaryBranchName = 'main',
    packageJsonPath = './package.json',
  } = spec;

  let {
    currentVersion = '0.1.0', // git init basic version is initially 0.1.0
    featureBranchName = 'baseline',
  } = spec;

  await initializeRepo();

  return Object.freeze({
    toJSON: toJSON,
  });

  /**
  * A helper function to log steps with a consistent style.
  * @param {string} message The message to log.
  */
  function logStep(message) {
    console.log(`
✅ ${message}`);
  }

  /**
   * A helper function to log warnings.
   * @param {string} message The warning message to log.
   */
  function logWarning(message) {
    console.log(`
⚠️  ${message}`);
  }

  /**
   * A helper function to log errors.
   * @param {string} message The error message to log.
   * @param {any} error The error object.
   */
  function logError(message, error) {
    console.error(`
❌ ${message}`);
    console.error('   Error details:', error.message || error);
  }

  /**
   * Main function to orchestrate the repository initialization.
   * @returns {Promise<void>}
   */
  async function initializeRepo() {
    try {
      // Step 1: Initialize Git repository
      logStep(`Initializing Git repository naming primary branch "${primaryBranchName}" branch...`);
      await $`git init --initial-branch=${primaryBranchName}`;

      // Step 2: Configure Git Flow to use the preferred primary branch name
      logStep(`Configuring Git Flow to use "${primaryBranchName}" and "develop" branches...`);
      await $`git config gitflow.branch.master ${primaryBranchName}`;
      await $`git config gitflow.branch.develop develop`;

      // Step 3: Configure Git Flow version tag prefix
      logStep('Configuring Git Flow version tag prefix to "v"...');
      await $`git config gitflow.prefix.versiontag v`;

      // Step 4: Initialize Git Flow using the new configuration
      logStep('Initializing Git Flow with configured settings...');
      // The -d flag accepts the default settings
      await $`git flow init -d`;

      // Step 5: Start a new feature branch
      logStep(`Starting Git Flow feature branch: "${featureBranchName}"...`);
      await $`git flow feature start ${featureBranchName}`;

      // Step 6: Initialize Bun project
      logStep('Initializing Bun project...');
      await $`bun init -y`;

      // Step 7: Modify package.json's version
      logStep(`Updating ${packageJsonPath}'s version...`);
      await $`bash -ic "source ~/.functions; vp ${featureBranchName}"`

      // Step 8: Sort package.json if the tool is available
      logStep('Checking for sort-package-json...');
      if (which('sort-package-json')) {
        logStep('Sorting package.json...');
        await $`sort-package-json`;
      } else {
        logWarning(`'sort-package-json' not found.`);
        console.log(`   To automatically sort package.json on init, please install it globally: `);
        console.log(`   bun add -g sort-package-json@latest`);
      }

      // Step 9: Stage and commit the initial project files
      logStep('Staging initial project files...');
      await $`git add .`;
      logStep('Committing initial project files...');
      await $`git commit -m "feat: v${currentVersion} baseline project for git flow and bun pm...

 - set the branch scheme with v as version prefix
 - added basic package dev dependencies useful with types
 - ok to use js with jsdoc for types if writing javascript
"`;

      // Step 10: Finish the feature branch
      logStep(`Finishing Git Flow feature branch: "${featureBranchName}"...`);
      await $`git flow feature finish ${featureBranchName}`;

      // Step 11: Start the release branch
      const releaseVersion = currentVersion.split('-')[0];
      logStep(`Starting Git Flow release branch: "${releaseVersion}"...`);
      await $`git flow release start ${releaseVersion}`;

      // Step 12: Update package.json to the release version
      logStep(`Updating ${packageJsonPath}'s version...`);
      await $`bash -ic "source ~/.functions; v ${releaseVersion}"`

      // Step 13: Commit the version change
      logStep('Committing release version...');
      await $`git add ${packageJsonPath}`;
      await $`git commit -m "chore: v${releaseVersion} RC.0 semver only"`;

      // Step 14: Finish the release branch
      logStep(`Finishing Git Flow release branch: "${releaseVersion}"...`);
      await $`bash -ic "source ~/.functions; git flow release finish ${releaseVersion}`;

      console.log(`
🎉 Repository setup complete!`);
      console.log(`   - Git and Git Flow initialized(using "main" branch).`);
      console.log(`   - Project created.`);
      console.log(`   - Version set to ${currentVersion} in package.json.`);
      console.log(`   - Initial project files committed.`);
      console.log(`   - Feature branch "${featureBranchName}" finished.`);
      console.log(`   - Release branch "v${currentVersion}" started and finished.`);

      console.log(`
\x1b[1m\x1b[32m✅  Git and Git Flow initialized successfully!\x1b[0m

\x1b[1m\x1b[33mNext Steps: Connect to a Private GitHub Repository\x1b[0m

Your local repository is ready. Use one of the following methods to create a
private repository on GitHub and set it as your remote 'origin'.

\x1b[1m------------------------------------------------------------------\x1b[0m
\x1b[1mMethod 1: Using the GitHub CLI ('gh') - (Recommended)\x1b[0m
\x1b[1m------------------------------------------------------------------\x1b[0m
This is the fastest and most efficient method.

\x1b[36m1. Create the repository and set the remote in one step:\x1b[0m
   Run the following command, replacing '[your-org]/[repo-name]' with your
   GitHub username/organization and desired repository name.

   \x1b[35mgh repo create [your-org]/[repo-name] --private --source=. --remote=origin\x1b[0m

\x1b[36m2. Push your initial code to GitHub:\x1b[0m
   This pushes your 'main' and 'develop' branches and any tags.

   \x1b[35mgit push -u origin --all && git push -u origin --tags\x1b[0m

\x1b[1m------------------------------------------------------------------\x1b[0m
\x1b[1mMethod 2: Manual Setup (Without the GitHub CLI)\x1b[0m
\x1b[1m------------------------------------------------------------------\x1b[0m
Use this method if you do not have 'gh' installed.

\x1b[36m1. Create a new repository on GitHub:\x1b[0m
   Go to \x1b[4mhttps://github.com/new\x1b[0m and create a new \x1b[1mPRIVATE\x1b[0m repository.
   Do \x1b[1mNOT\x1b[0m initialize it with a README, .gitignore, or license.

\x1b[36m2. Copy the repository URL (SSH is recommended):\x1b[0m
   \x1b[1mSSH:\x1b[0m   git@github.com:[your-org]/[repo-name].git
   \x1b[1mHTTPS:\x1b[0m https://github.com/[your-org]/[repo-name].git

\x1b[36m3. Add the remote to your local repository:\x1b[0m
   Use the URL you copied in the previous step.

   \x1b[35mgit remote add origin [the-url-you-copied]\x1b[0m

\x1b[36m4. Push your initial code to GitHub:\x1b[0m

   \x1b[35mgit push -u origin --all && git push -u origin --tags\x1b[0m
`);

    } catch (error) {
      logError('An error occurred during initialization.', error);
      process.exit(1); // Exit with an error code
    }
  }

  /**
   * This returns an object of selected members; it can be called directly or
   * using JSON.stringify on an Object made by invoking this cfoo.
   * @return {object} Snapshot - selected items for logging or debugging
   */
  function toJSON() {
    const snapshot = {
      title: `a selective snapshot of function initializeGitAndGitFlow(spec)`,
      spec,
      toJSON,
    };
    return Object.freeze(snapshot);
  }
}

await initializeGitAndGitFlow({
  featureBranchName: 'baseline',
  currentVersion: '0.1.0', // git init basic version is initially 0.1.0
  packageJsonPath: './package.json',
});
