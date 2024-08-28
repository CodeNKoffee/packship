import { Command } from 'commander';
import { createPackage } from '../utils/createPackage';
import { promptPackageDetails } from '../utils/prompt';
const program = new Command();
program
    .command('init')
    .description('Initialize a new npm package')
    .action(async () => {
    const details = await promptPackageDetails();
    await createPackage(details);
    console.log(`Initialized new npm package: ${details.name}`);
});
export default program;
