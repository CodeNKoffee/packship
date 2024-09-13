import Handlebars from "handlebars";
// Register custom helper for JSON stringification
export function registerHandlebarsHelpers() {
    Handlebars.registerHelper("JSONstringify", function (context) {
        return JSON.stringify(context, null, 2); // Ensuring proper formatting
    });
}
