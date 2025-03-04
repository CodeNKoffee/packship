import Handlebars from "handlebars";

/**
 * Register custom Handlebars helpers for template rendering
 */
export function registerHandlebarsHelpers() {
  // Helper for JSON stringification
  Handlebars.registerHelper("JSONstringify", function (context) {
    return JSON.stringify(context, null, 2); // Ensuring proper formatting
  });
}