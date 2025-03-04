import fs from 'fs';
import path from 'path';
import { renderTemplate } from './fileUtils.js';
import { PackageData } from '../types/index.js';

/**
 * Copy template files to the target directory, processing Handlebars templates
 * @param sourceDir Source template directory
 * @param targetDir Target directory for the new package
 * @param packageData Package data for template rendering
 */
export async function watchCopy(
  sourceDir: string,
  targetDir: string,
  packageData: PackageData
): Promise<void> {
  try {
    // Read the source directory
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    // Process each entry
    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name.replace('.hbs', ''));

      if (entry.isDirectory()) {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }

        // Recursively copy the directory contents
        await watchCopy(sourcePath, targetPath, packageData);
      } else {
        // Process the file
        if (entry.name.endsWith('.hbs')) {
          // Render the template
          const content = renderTemplate(entry.name, packageData);
          fs.writeFileSync(targetPath, content);
        } else {
          // Copy the file as is
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }

    console.log(`Files copied from ${sourceDir} to ${targetDir}`);
  } catch (error) {
    console.error('Error copying files:', error);
    throw error;
  }
}