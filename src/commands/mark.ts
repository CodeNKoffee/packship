import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { select, confirm } from "@clack/prompts";
import { MESSAGE, printFormatted } from "../utils/colors.js";
import { validatePackshipPackage } from "../utils/packageValidator.js";
import { sendTelemetryEvent } from "../utils/telemetry.js";

const markCommand = new Command("mark");

markCommand
  .description("Mark an existing package as Packship-initialized")
  .action(async () => {
    try {
      // Check if we're in a package directory
      const { packageJsonExists, isPackshipPackage, packageData } = validatePackshipPackage();

      if (isPackshipPackage) {
        printFormatted([
          MESSAGE.SUCCESS('✅ This package is already marked as a Packship package.'),
          MESSAGE.INFO('No further action needed.')
        ], { startWithNewLine: true, endWithNewLine: true });
        return;
      }

      if (!packageJsonExists) {
        printFormatted([
          MESSAGE.WARNING('⚠️ No package.json found in the current directory.'),
          MESSAGE.INFO('You need to be in a valid npm package directory to use this command.')
        ], { startWithNewLine: true, endWithNewLine: true });
        return;
      }

      // Ask how to mark the package
      const markMethod = await select({
        message: 'How would you like to mark this package as a Packship package?',
        options: [
          { value: 'package.json', label: 'Add _packshipInitialized flag to package.json' },
          { value: '.packshiprc', label: 'Create a .packshiprc file' },
          { value: 'both', label: 'Both methods (recommended)' }
        ],
        initialValue: 'both'
      });

      if (markMethod === 'package.json' || markMethod === 'both') {
        // Update package.json
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const updatedPackageData = { ...packageData, _packshipInitialized: true };
        fs.writeFileSync(packageJsonPath, JSON.stringify(updatedPackageData, null, 2));
        printFormatted([
          MESSAGE.SUCCESS('✅ Added _packshipInitialized flag to package.json')
        ], { startWithNewLine: true });
      }

      if (markMethod === '.packshiprc' || markMethod === 'both') {
        // Create .packshiprc file
        const packshipRcPath = path.join(process.cwd(), '.packshiprc');
        fs.writeFileSync(packshipRcPath, JSON.stringify({ initialized: true }, null, 2));
        printFormatted([
          MESSAGE.SUCCESS('✅ Created .packshiprc file')
        ], { startWithNewLine: true });
      }

      // Ask if user wants to add .packshiprc to .gitignore
      if (markMethod === '.packshiprc' || markMethod === 'both') {
        const addToGitignore = await confirm({
          message: 'Would you like to add .packshiprc to your .gitignore file?',
          initialValue: true
        });

        if (addToGitignore) {
          const gitignorePath = path.join(process.cwd(), '.gitignore');
          let gitignoreContent = '';

          // Check if .gitignore exists
          if (fs.existsSync(gitignorePath)) {
            gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

            // Check if .packshiprc is already in .gitignore
            if (!gitignoreContent.includes('.packshiprc')) {
              // Add .packshiprc to .gitignore
              gitignoreContent += '\n# Packship configuration\n.packshiprc\n';
              fs.writeFileSync(gitignorePath, gitignoreContent);
              printFormatted([
                MESSAGE.SUCCESS('✅ Added .packshiprc to .gitignore')
              ], { startWithNewLine: true });
            } else {
              printFormatted([
                MESSAGE.INFO('.packshiprc is already in .gitignore')
              ], { startWithNewLine: true });
            }
          } else {
            // Create .gitignore file
            gitignoreContent = '# Packship configuration\n.packshiprc\n';
            fs.writeFileSync(gitignorePath, gitignoreContent);
            printFormatted([
              MESSAGE.SUCCESS('✅ Created .gitignore file with .packshiprc entry')
            ], { startWithNewLine: true });
          }
        }
      }

      printFormatted([
        MESSAGE.SUCCESS('🎉 Package successfully marked as a Packship package!'),
        MESSAGE.INFO('You can now use all Packship commands with this package.')
      ], { startWithNewLine: true, endWithNewLine: true });

      // Send telemetry event
      await sendTelemetryEvent({
        type: 'mark',
        name: 'package_marked',
        data: {
          success: true,
          method: markMethod
        }
      });
    } catch (error) {
      printFormatted([
        MESSAGE.ERROR('❌ An error occurred while marking the package:'),
        MESSAGE.ERROR(error instanceof Error ? error.message : String(error))
      ], { startWithNewLine: true, endWithNewLine: true });

      // Send telemetry event for error
      await sendTelemetryEvent({
        type: 'mark',
        name: 'package_mark_failed',
        data: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  });

export default markCommand; 