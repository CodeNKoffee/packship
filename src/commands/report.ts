import { Command } from "commander";
import { submitIssue } from "../utils/issueReporter.js";
import { MESSAGE } from "../utils/colors.js";

const reportCommand = new Command("report");

reportCommand
  .description("Report an issue with the Packship tool itself")
  .action(async () => {
    try {
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