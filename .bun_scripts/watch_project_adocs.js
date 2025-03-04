/**
 * @fileoverview Watches all non-ignored AsciiDoc (.adoc) files in a Git project
 * and triggers conversion to HTML whenever a change is detected.
 * Converted files are placed in an "adoc_generated" directory at the project root.
 * If not in a Git project, an error is thrown.
 * // TODO review if want to add conversion to PDF see commented line of code
 * This script follows the Google JavaScript Style Guide.
 * Presumes the existence of a "cast_adoc" bash function that expects asciidoctor and
 * asciidoctor-pdf to be installed (preferably via asdf).
 */

/** @type {import('bun-types').Bun } */
import { mkdir } from "fs/promises";
import { join, resolve } from "path";
import { watch } from "fs";

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
    await mkdir(outputDir, { recursive: true });

    const lsProc = Bun.spawn({
      cmd: ["git", "ls-files", "*.adoc"],
      stdout: "pipe",
      stderr: "pipe",
    });
    const lsOutput = await new Response(lsProc.stdout).text();
    const lsExitCode = await lsProc.exited;
    if (lsExitCode !== 0) {
      console.error("Error retrieving .adoc files list.");
      return;
    }
    const files = lsOutput.split("\n").filter((line) => line.trim() !== "");
    console.log(`Watching ${files.length} AsciiDoc file(s) for changes...`);

    const debounceTimeout = {};
    for (const file of files) {
      const absoluteFilePath = resolve(projectRoot, file); // Convert to absolute path
      watch(absoluteFilePath, (eventType, filename) => {
        console.log(`Change detected in ${file}:`, eventType, filename);
        // Debounce: wait 500ms after the last event before triggering conversion.
        if (debounceTimeout[file]) {
          clearTimeout(debounceTimeout[file]);
        }
        debounceTimeout[file] = setTimeout(async () => {
          await convertFile(absoluteFilePath, "html", outputDir);
          // await convertFile(absoluteFilePath, "pdf", outputDir);
          debounceTimeout[file] = null;
        }, 500);
      });
    }
  } catch (error) {
    console.error("Error in watchAdocFiles:", error);
  }
}

watchAdocFiles();

