import { Command } from "commander";
import { submitIssue } from "../utils/issueReporter.js";
import { MESSAGE } from "../utils/colors.js";
import { validatePackshipPackage } from "../utils/packageValidator.js";

const reportCommand = new Command("report");

reportCommand
  .description("Report an issue with the Packship tool itself")
  .action(async () => {
    try {
      // Check if we're in a package directory
      const { packageJsonExists, isPackshipPackage } = validatePackshipPackage();

      if (packageJsonExists && !isPackshipPackage) {
        console.log(MESSAGE.WARNING('⚠️  This package was not initialized with Packship.'));
        console.log(MESSAGE.INFO('The `packship report` command is specifically for reporting issues with the Packship tool itself,'));
        console.log(MESSAGE.INFO('not for issues with your npm package.'));
        console.log('');
        console.log(MESSAGE.INFO('If you\'re trying to report an issue with your package, please refer to your package documentation.'));
        console.log(MESSAGE.INFO('If you\'re trying to report an issue with Packship, you can continue.'));
        console.log('');
      }

      console.log(MESSAGE.INFO('This command is for reporting issues with the Packship tool itself.'));
      console.log(MESSAGE.INFO('If you\'re experiencing issues with your npm package, please refer to the package documentation.'));
      console.log('');

      await submitIssue();
      // No telemetry tracking for report command
    } catch (error) {
      console.error(MESSAGE.ERROR("An error occurred while reporting the issue:"), error);
      // No telemetry tracking for errors
    }
  });

export default reportCommand; 