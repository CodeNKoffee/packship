import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Renders a Handlebars template with the provided data
 * @param templatePath Path to the template file or template content
 * @param data Data to be used in the template
 * @returns Rendered template as a string
 */
export function renderTemplate(templatePath, data) {
    try {
        let templateContent;
        // Check if templatePath is a file path and if the file exists
        if (fs.existsSync(templatePath)) {
            templateContent = fs.readFileSync(templatePath, "utf-8");
        }
        else {
            // If not a file path, assume it's the template content
            templateContent = templatePath;
        }
        const template = Handlebars.compile(templateContent);
        return template(data);
    }
    catch (error) {
        console.error(`Error rendering template: ${error instanceof Error ? error.message : String(error)}`);
        return ""; // Return empty string on error
    }
}
/**
 * Ensures that a directory exists for a given file path
 * @param filePath Path to the file
 */
export function ensureDirectoryExists(filePath) {
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
}
