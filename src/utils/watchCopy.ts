import chokidar from 'chokidar';
import { exec } from 'child_process';

// Function to ignore dotfiles
const ignoreDotfiles = (path: string): boolean => {
  return /(^|[\/\\])\../.test(path); // Regular expression to match dotfiles
};

// Watch the current project directory for duplication (copy events)
const watcher = chokidar.watch('.', {
  ignored: ignoreDotfiles, // Ignore dotfiles
  persistent: true,
});

// Detect if files are added (e.g., someone copied the directory)
watcher.on('addDir', (path: string) => {
  console.log(`New directory detected: ${path}`);
  
  // Replace 'user's name' with the actual user's name if available
  const message = `"This project is licensed exclusively. 
  Copying, distributing, or redistributing this project for other users or products is strictly prohibited. 
  Violating this license agreement may result in legal consequences."`;

  exec(`notify-send "${message}"`);
});