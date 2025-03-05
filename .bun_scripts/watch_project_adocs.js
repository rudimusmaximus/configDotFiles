/**
 * @fileoverview Watches all non-ignored AsciiDoc (.adoc) files in a Git project,
 * including those passed as command-line arguments (even if untracked) and any tracked
 * files returned by `git ls-files`. Triggers conversion to HTML whenever a change is detected.
 * Converted files are placed in an "adoc_generated" directory at the project root.
 * If not in a Git project, an error is thrown.
 * Presumes the existence of a "cast_adoc" bash function that expects asciidoctor and
 * asciidoctor-pdf to be installed (preferably via asdf).
 */

/** @type {import('bun-types').Bun } */
import { mkdir } from "fs/promises";
import { watchFile } from "fs";
import { join, resolve } from "path";
// Note: watchFile is imported from "fs" (Node/Bun built-in)
// which provides a polling alternative to fs.watch.

async function getProjectRoot() {
  const proc = Bun.spawn({
    cmd: ["git", "rev-parse", "--show-toplevel"],
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  if (exitCode !== 0 || !stdout.trim()) {
    throw new Error("Error: Not in a Git project. Cannot determine project root.");
  }
  return stdout.trim();
}

async function convertFile(filePath, target, outputDir) {
  const command = `cast_adoc "${filePath}" ${target} "${outputDir}" --no-open`;
  const proc = Bun.spawn({
    cmd: ["bash", "-ic", command],
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;
  if (exitCode === 0) {
    console.log(`Converted ${filePath} to ${target} successfully:\n${stdout.trim()}`);
  } else {
    console.error(`Error converting ${filePath} to ${target}:\n${stderr}`);
  }
}

async function watchAdocFiles() {
  try {
    const projectRoot = await getProjectRoot();
    const outputDir = join(projectRoot, "adoc_generated");
    // mkdir from fs/promises is used here; it returns a Promise.
    await mkdir(outputDir, { recursive: true });

    // Files provided as command-line arguments (may be untracked)
    const passedFiles = process.argv.slice(2)
      .filter((arg) => arg.toLowerCase().endsWith(".adoc"));
    const absolutePassedFiles = passedFiles.map((file) => resolve(projectRoot, file));

    // Get tracked .adoc files using git ls-files.
    const lsProc = Bun.spawn({
      cmd: ["git", "ls-files"],
      stdout: "pipe",
      stderr: "pipe",
    });
    const lsOutput = await new Response(lsProc.stdout).text();
    const lsExitCode = await lsProc.exited;
    let trackedFiles = [];
    if (lsExitCode === 0) {
      trackedFiles = lsOutput.split("\n")
        .filter((line) => line.trim().endsWith(".adoc"))
        .map((file) => resolve(projectRoot, file));
    } else {
      console.error("Error retrieving .adoc files list from git.");
    }

    // Merge passed files and tracked files, avoiding duplicates.
    const allFilesSet = new Set([...absolutePassedFiles, ...trackedFiles]);
    const files = Array.from(allFilesSet);

    console.log(`Watching ${files.length} AsciiDoc file(s) for changes...`);

    // Use fs.watchFile to poll for file changes.
    for (const file of files) {
      // Setting an interval of 500ms for polling.
      watchFile(file, { interval: 500 }, async (curr, prev) => {
        // If the modification time has increased, a change occurred.
        if (curr.mtimeMs !== prev.mtimeMs) {
          console.log(`Change detected in ${file}`);
          await convertFile(file, "html", outputDir);
        }
      });
    }
  } catch (error) {
    console.error("Error in watchAdocFiles:", error);
  }
}

watchAdocFiles();
