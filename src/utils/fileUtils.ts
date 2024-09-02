import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the renderTemplate function to read and compile Handlebars templates
export function renderTemplate(templatePath: string, data: { name?: string; description?: string }): string {
  const templateContent = fs.readFileSync(path.join(__dirname, '../../templates', templatePath), 'utf-8');
  const template = Handlebars.compile(templateContent);
  const renderedTemplate = template(data);
  return renderedTemplate;
}

export function ensureDirectoryExists(filePath: string) {
  const dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  fs.mkdirSync(dirName);
}