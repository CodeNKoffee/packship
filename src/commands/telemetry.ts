import { Command } from "commander";
import { enableTelemetry, disableTelemetry, getTelemetryStatus } from "../utils/telemetry.js";

const telemetryCommand = new Command("telemetry");

telemetryCommand
  .description("Manage anonymous telemetry settings")
  .addCommand(
    new Command("status")
      .description("Show current telemetry status")
      .action(() => {
        const isEnabled = getTelemetryStatus();
        console.log(`Telemetry is currently ${isEnabled ? 'enabled' : 'disabled'}.`);
        if (isEnabled) {
          console.log('PackShip collects anonymous usage data to help improve the tool.');
          console.log('This data includes command usage and error rates, but never includes personal information or code.');
          console.log('You can opt out at any time by running: packship telemetry disable');
        }
      })
  )
  .addCommand(
    new Command("enable")
      .description("Enable anonymous telemetry")
      .action(() => {
        enableTelemetry();
      })
  )
  .addCommand(
    new Command("disable")
      .description("Disable anonymous telemetry")
      .action(() => {
        disableTelemetry();
      })
  );

export default telemetryCommand; 