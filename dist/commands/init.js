var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command } from 'commander';
import { createPackage } from '../utils/createPackage';
import { promptPackageDetails } from '../utils/prompt';
const program = new Command();
program
    .command('init')
    .description('Initialize a new npm package')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield promptPackageDetails();
    yield createPackage(details);
    console.log(`Initialized new npm package: ${details.name}`);
}));
export default program;
