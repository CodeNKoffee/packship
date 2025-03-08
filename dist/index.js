#!/usr/bin/env node
// Load environment variables from .env file
import 'dotenv/config';
import { Command } from "commander";
import initCommand from "./commands/init.js";
import versionCommand, { getVersion } from "./commands/version.js";
import publishCommand from "./commands/publish.js";
import telemetryCommand from "./commands/telemetry.js";
import reportCommand from "./commands/report.js";
const program = new Command();
// Set up the CLI structure
program
    .name("packship")
    .description("CLI to help ship npm packages faster")
    .version(getVersion());
// Register commands correctly with names
program.addCommand(initCommand);
program.addCommand(versionCommand);
program.addCommand(publishCommand);
program.addCommand(telemetryCommand);
program.addCommand(reportCommand);
// Parse the command-line arguments
program.parse(process.argv);
