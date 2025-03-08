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

      if (packageJsonExists && !isPackshipPackage) {
        printFormatted([
          MESSAGE.WARNING('⚠️  This package was not initialized with Packship.'),
          MESSAGE.INFO('The `packship report` command is specifically for reporting issues with the Packship tool itself, not for issues with your npm package.'),
          MESSAGE.INFO('If you\'re trying to report an issue with your package, please refer to your package documentation.'),
          MESSAGE.INFO('If you want to report an issue with Packship, please run this command outside of a package directory or in a package that was initialized with Packship.')
        ], { startWithNewLine: true, endWithNewLine: true });

        process.exit(1); // Exit early
      }

      printFormatted([
        MESSAGE.INFO('This command is for reporting issues with the Packship tool itself.'),
        MESSAGE.INFO('If you\'re experiencing issues with your npm package, please refer to the package documentation.')
      ], { startWithNewLine: true, endWithNewLine: true });

      await submitIssue();
      // No telemetry tracking for report command
    } catch (error) {
      console.error(MESSAGE.ERROR("An error occurred while reporting the issue:"), error);
      // No telemetry tracking for errors
    }
  });

export default reportCommand; 