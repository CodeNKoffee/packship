import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';

const initCommand = new Command("init");

initCommand
  .description('Initialize a new npm package')
  .action(async () => {
    const packageName = await createPackage();
    console.log(`Initialized your new npm package: ${packageName}\n\nHappy packshipping! 📦🛻💨\n`);
  });

export default initCommand;