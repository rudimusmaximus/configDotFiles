import { readdir, stat } from 'fs/promises';
import path from 'path';

// Parse command line arguments for -r and number
const args = process.argv.slice(2);
const recursive = args.includes('-r');
const nArgIndex = args.findIndex(arg => !isNaN(parseInt(arg)) && arg !== '-r');
const n = nArgIndex !== -1 ? parseInt(args[nArgIndex], 10) : 1;

listRecentFilesDetailed(n, recursive).catch(console.error);

// Helper to format file size
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

// Function to recursively list files with full paths
async function listFilesRecursive(dir, allFiles = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (let entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await listFilesRecursive(entryPath, allFiles);
    } else {
      allFiles.push(entryPath);
    }
  }
  return allFiles;
}

async function listRecentFilesDetailed(n = 1, recursive = false) {
  let files;
  if (recursive) {
    files = await listFilesRecursive('.');
  } else {
    files = (await readdir('.', { withFileTypes: true }))
      .filter(f => f.isFile())
      .map(f => `./${f.name}`); // Prepend './' for consistency
  }

  const fileDetails = await Promise.all(
    files.map(async (filePath) => {
      const stats = await stat(filePath);
      return {
        Path: filePath,
        Size: formatSize(stats.size),
        Modified: stats.mtime.toLocaleString(),
      };
    })
  );

  // Sort by modification time, most recent first
  fileDetails.sort((a, b) => new Date(b.Modified) - new Date(a.Modified));

  // Slice the top N files
  const recentFiles = fileDetails.slice(0, n);

  // Print details using console.table
  console.table(recentFiles);
}

