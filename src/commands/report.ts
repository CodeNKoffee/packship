import { Command } from "commander";
import { submitIssue } from "../utils/issueReporter.js";
import { MESSAGE, printFormatted } from "../utils/colors.js";
import { validatePackshipPackage } from "../utils/packageValidator.js";

const reportCommand = new Command("report");

reportCommand
  .description("Report an issue with the Packship tool itself")
  .action(async () => {
    try {
      // Check if we're in a package directory
      const { packageJsonExists, isPackshipPackage } = validatePackshipPackage();

      // Only show warning for non-packship npm packages
      if (packageJsonExists && !isPackshipPackage) {
        printFormatted([
          MESSAGE.WARNING('⚠️  This package was not initialized with Packship.'),
          MESSAGE.INFO('The `packship report` command is for reporting issues with the Packship tool itself, not for issues with your npm package.'),
          MESSAGE.INFO('If you\'re trying to report an issue with your package, please refer to your package documentation.'),
          MESSAGE.INFO('You can proceed with reporting an issue about the Packship tool.')
        ], { startWithNewLine: true, endWithNewLine: true });

        // Continue execution - don't exit
      } else {
        // For packship-initialized packages or non-package directories
        printFormatted([
          MESSAGE.INFO('This command is for reporting issues with the Packship tool itself.'),
          MESSAGE.INFO('If you\'re experiencing issues with your npm package, please refer to the package documentation.')
        ], { startWithNewLine: true, endWithNewLine: true });
      }

      await submitIssue();
      // No telemetry tracking for report command
    } catch (error) {
      console.error(MESSAGE.ERROR("An error occurred while reporting the issue:"), error);
      // No telemetry tracking for errors
    }
  });

export default reportCommand; 