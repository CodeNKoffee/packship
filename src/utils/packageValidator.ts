import fs from 'fs';
import path from 'path';
import { MESSAGE, printFormatted } from './colors.js';

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
    const packshipRcPath = path.join(process.cwd(), '.packshiprc');

    // Check if package.json exists
    if (!fs.existsSync(packageJsonPath)) {
      // Even if package.json doesn't exist, check for .packshiprc
      const hasPackshipRc = fs.existsSync(packshipRcPath);

      return {
        isPackshipPackage: hasPackshipRc,
        packageData: null,
        packageJsonExists: false
      };
    }

    // Read package.json
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check for Packship signature in package.json
    const hasPackshipFlag = packageData._packshipInitialized === true;

    // Also check for .packshiprc file
    const hasPackshipRc = fs.existsSync(packshipRcPath);

    // Package is considered a Packship package if either condition is true
    const isPackshipPackage = hasPackshipFlag || hasPackshipRc;

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
  printFormatted([
    MESSAGE.WARNING('⚠️  This package was not initialized with Packship.'),
    MESSAGE.INFO('For the best experience, we recommend initializing your packages with:'),
    MESSAGE.HIGHLIGHT('  packship init'),
    MESSAGE.INFO('However, we\'ll proceed with your request anyway.')
  ], { startWithNewLine: true, endWithNewLine: true });
} 