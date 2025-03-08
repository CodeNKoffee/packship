import fs from 'fs';
import path from 'path';
import { MESSAGE } from './colors.js';

/**
 * Check if the current package was initialized with Packship
 * @returns Object with validation result and package data
 */
export function validatePackshipPackage(): {
  isPackshipPackage: boolean;
  packageData: any | null;
  packageJsonExists: boolean;
} {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    // Check if package.json exists
    if (!fs.existsSync(packageJsonPath)) {
      return {
        isPackshipPackage: false,
        packageData: null,
        packageJsonExists: false
      };
    }

    // Read package.json
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check for Packship signature
    // We'll look for a custom field that Packship adds during initialization
    // If this field doesn't exist yet, we'll need to modify the createPackage function to add it
    const isPackshipPackage = packageData._packshipInitialized === true;

    return {
      isPackshipPackage,
      packageData,
      packageJsonExists: true
    };
  } catch (error) {
    console.error(MESSAGE.ERROR('Error validating package:'), error);
    return {
      isPackshipPackage: false,
      packageData: null,
      packageJsonExists: false
    };
  }
}

/**
 * Display a warning if the package wasn't initialized with Packship
 */
export function showNonPackshipWarning(): void {
  console.log(MESSAGE.WARNING('⚠️  This package was not initialized with Packship.'));
  console.log(MESSAGE.INFO('For the best experience, we recommend initializing your packages with:'));
  console.log(MESSAGE.HIGHLIGHT('  packship init'));
  console.log(MESSAGE.INFO('However, we\'ll proceed with your request anyway.'));
  console.log('');
} 