import { Command } from "commander";
import { createPackage } from "../utils/createPackage.js";
import { askForTelemetryConsent, sendTelemetryEvent } from "../utils/telemetry.js";
import { MESSAGE } from "../utils/colors.js";

const initCommand = new Command("init");

initCommand
  .description("\nInitialize a new npm package")
  .action(async () => {
    try {
      // Ask for telemetry consent if not already configured
      await askForTelemetryConsent();

      // Proceed with package creation
      const packageName = await createPackage();

      // Send telemetry event for successful initialization
      await sendTelemetryEvent({
        type: 'init',
        name: 'package_initialized',
        data: {
          success: true
        }
      });

      console.log(`\n${MESSAGE.SUCCESS(`Initialized your new npm package: ${String(packageName)}`)}\n\n${MESSAGE.HIGHLIGHT('Happy packshipping! 📦🛻💨')}\n`);
    } catch (error) {
      // Send telemetry event for failed initialization
      await sendTelemetryEvent({
        type: 'init',
        name: 'package_initialization_failed',
        data: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      console.error(`\n${MESSAGE.ERROR('An error occurred during the process:')} ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

export default initCommand;