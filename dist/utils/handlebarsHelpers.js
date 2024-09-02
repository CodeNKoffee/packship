import Handlebars from 'handlebars';
export function registerHandlebarsHelpers() {
    Handlebars.registerHelper('if_eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });
    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });
}
