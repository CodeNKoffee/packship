import Handlebars from 'handlebars';

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('if_eq', function(this: any, a: any, b: any, options: any) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('toLowerCase', function(str: string) {
    return str.toLowerCase();
  });
}