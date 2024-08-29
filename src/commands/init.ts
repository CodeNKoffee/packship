import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { promptPackageDetails } from '../utils/prompt.js';
import path from 'path';
import { Plop } from 'plop';  // Correctly import Plop

const program = new Command();

program
  .command('init')
  .description('Initialize a new npm package')
  .action(async () => {
    await runPlop();

    const details = await promptPackageDetails();
    await createPackage(details);
    console.log(`Initialized new npm package: ${details.name}`);
  });

async function runPlop() {
  const plopfilePath = path.join(__dirname, '../plopfile.js');
  
  // Prepare Plop
  Plop.prepare(
    {
      cwd: process.cwd(),
      configPath: plopfilePath,
      preload: {} as any,
    },
    (env) => {
      Plop.execute(env, (env) => {
        console.log('Plop execution completed');
      });
    }
  );
}

export default program;