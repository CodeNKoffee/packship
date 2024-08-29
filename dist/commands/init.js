import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { promptPackageDetails } from '../utils/prompt.js';
import path from 'path';
import { Plop, run } from 'plop';
const program = new Command();
program
    .command('init')
    .description('Initialize a new npm package')
    .action(async () => {
    const details = await promptPackageDetails();
    await createPackage(details);
    console.log(`Initialized new npm package: ${details.name}`);
    await runPlop(details);
});
async function runPlop(details) {
    const plopfilePath = path.join(__dirname, '../../plopfile.js');
    Plop.prepare({
        cwd: process.cwd(),
        configPath: plopfilePath,
        preload: {},
    }, (env) => {
        Plop.execute(env, (env) => {
            run(env, {
                generator: 'init',
                data: details
            }, true)
                .then(() => {
                console.log('Plop execution completed from init');
            })
                .catch((error) => {
                console.error('Plop execution error:', error);
            });
        });
    });
}
export default program;
