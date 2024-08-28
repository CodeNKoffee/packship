var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
// Define the renderTemplate function to read and compile Handlebars templates
function renderTemplate(templatePath, data) {
    const templateContent = fs.readFileSync(path.join(__dirname, '../../plop-templates', templatePath), 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(data);
}
export function createPackage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, description }) {
        const packageDir = path.join(process.cwd(), name);
        if (fs.existsSync(packageDir)) {
            throw new Error(`Directory ${name} already exists.`);
        }
        fs.mkdirSync(packageDir);
        // List all the files with their corresponding Handlebars templates and data
        const files = [
            { name: 'package.json', template: 'package.json.hbs', data: { name, description } },
            { name: 'README.md', template: 'README.md.hbs', data: { name, description } },
            { name: '.gitignore', template: '.gitignore.hbs', data: {} },
            { name: '.npmignore', template: '.npmignore.hbs', data: {} },
            { name: 'babel.config.js', template: 'babel.config.hbs', data: {} },
            { name: 'CODE_OF_CONDUCT.md', template: 'CODE_OF_CONDUCT.md.hbs', data: { name } },
            { name: '.eslintrc.json', template: 'eslintrc.json.hbs', data: {} },
            { name: 'index.js', template: 'index.js.hbs', data: {} },
            { name: 'index.ts', template: 'index.ts.hbs', data: {} },
            { name: 'LICENSE.md', template: 'LICENSE.md.hbs', data: { name } },
            { name: 'postcss.config.js', template: 'postcss.config.hbs', data: {} },
            { name: 'webpack.config.js', template: 'webpack.config.hbs', data: {} }
        ];
        // Generate each file using its corresponding template
        files.forEach(({ name, template, data }) => {
            const filePath = path.join(packageDir, name);
            const content = renderTemplate(template, data);
            fs.writeFileSync(filePath, content);
        });
    });
}
