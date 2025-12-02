#!/usr/bin/env bun
/**
 * Shared helpers for git-flow automation scripts.
 * - runInteractiveBash: spawn bash with inherited stdio (needed for OSC/clipboard).
 * - annotateTag: create annotated tags with full terminal control.
 * - readInput: simple stdin prompt helper.
 * - getGitConfig: fetch a git config value (empty string if missing).
 */

import { $ } from 'bun';

/**
 * Executes a bash command using inherited stdio.
 * Useful when commands need full terminal control (e.g., clipboard OSC codes).
 *
 * @param {string} command - The bash command string to execute.
 * @throws {Error} If the command returns a non-zero exit code.
 * @return {Promise<void>}
 */
export async function runInteractiveBash(command) {
  const proc = Bun.spawn(['bash', '-c', command], {
    stdio: ['inherit', 'inherit', 'inherit'],
  });
  await proc.exited;
  if (proc.exitCode !== 0) {
    throw new Error(`Command failed: ${command}`);
  }
}

/**
 * Creates an annotated git tag using the configured editor.
 * If the user aborts the editor (non-zero exit), the tag is deleted.
 *
 * @param {object} options
 * @param {string} options.tagRef - The tag name (e.g., "v1.0.0").
 * @param {string} [options.target='main'] - The target branch/ref to tag.
 * @param {string} [options.editorCmd] - Optional editor command to use; defaults to git config/env.
 */
export async function annotateTag({ tagRef, target = 'main', editorCmd }) {
  const proc = Bun.spawn(
    ['git', 'tag', '-a', tagRef, target],
    {
      stdio: ['inherit', 'inherit', 'inherit'],
      env: {
        ...process.env,
        ...(editorCmd ? { GIT_EDITOR: editorCmd } : {}),
      },
    }
  );

  await proc.exited;

  if (proc.exitCode !== 0) {
    // If tag was created but user aborted editor, clean it up so reruns are clean
    try {
      await $`git tag -d ${tagRef}`.quiet();
    } catch {
      /* ignore cleanup failure */
    }
    throw new Error('Tag creation aborted.');
  }
}

/**
 * Prompts the user for input via standard output/input.
 * Uses Bun's console iterator for robust TTY handling.
 *
 * @param {string} question - The text to display to the user.
 * @return {Promise<string>} The user's input, trimmed.
 */
export async function readInput(question) {
  process.stdout.write(question);
  for await (const line of console) {
    return line.trim();
  }
  return '';
}

/**
 * Retrieves a value from the git configuration.
 * Returns a default (empty string) if the key is not found.
 *
 * @param {string} key - The git config key to look up.
 * @param {string} [defaultValue=''] - Value to return if not found.
 * @return {Promise<string>} The configuration value or default.
 */
export async function getGitConfig(key, defaultValue = '') {
  try {
    const result = await $`git config --get ${key}`.text();
    return result.trim() || defaultValue;
  } catch {
    return defaultValue;
  }
}
