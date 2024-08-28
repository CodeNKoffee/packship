import fs from 'fs';
import path from 'path';

export function renderTemplate(templateName: string, data: any): string {
  // Assume a function that renders Handlebars templates
  const templatePath = path.join(__dirname, '../plop-templates', templateName);
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const handlebars = require('handlebars');
  const template = handlebars.compile(templateContent);
  return template(data);
}