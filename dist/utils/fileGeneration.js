import fs from 'fs';
import path, { dirname } from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function generateFiles(files, packageData, packageDir) {
    for (const file of files) {
        const templatePath = path.join(__dirname, '..', 'templates', file.template);
        const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
        const compiledTemplate = Handlebars.compile(templateContent);
        const fileContent = compiledTemplate(packageData);
        const filePath = path.join(packageDir, file.name);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, fileContent, 'utf-8');
    }
}
