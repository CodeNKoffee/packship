import { Command } from "commander";
import { submitIssue } from "../utils/issueReporter.js";

const reportCommand = new Command("report");

reportCommand
  .description("Report an issue or request a feature")
  .action(async () => {
    try {
      await submitIssue();
      // No telemetry tracking for report command
    } catch (error) {
      console.error("\n\x1b[31m%s\x1b[0m", "An error occurred while reporting the issue:", error);
      // No telemetry tracking for errors
    }
  });

export default reportCommand; 