#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "./commands/init.js";
import versionCommand, { getVersion } from "./commands/version.js";
const program = new Command();
// Set up the CLI structure
program
    .name("packship")
    .description("CLI to help ship npm packages faster")
    .version(getVersion());
// Register commands correctly with names
program.addCommand(initCommand);
program.addCommand(versionCommand);
// Parse the command-line arguments
program.parse(process.argv);
