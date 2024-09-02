import fs from 'fs';
import path, { dirname } from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Handlebars.registerHelper('JSONstringify', function(context) {
  return JSON.stringify(context);
});

export async function generateFiles(files: any[], packageData: any, packageDir: string) {
  for (const file of files) {
    const templatePath = path.join(__dirname, '..', 'templates', file.template);
    const filePath = path.join(packageDir, file.name);
    const dirName = path.dirname(filePath);

    // Ensure the directory exists
    await fs.promises.mkdir(dirName, { recursive: true });

    // Check if the template path exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    const fileContent = Handlebars.compile(templateContent)(packageData);

    await fs.promises.writeFile(filePath, fileContent, 'utf8');
  }
}