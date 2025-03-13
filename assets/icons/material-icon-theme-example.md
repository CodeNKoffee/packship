# Contributing to Material Icon Theme

This is a guide for adding `.packshiprc` support to the popular [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) for VS Code.

## Steps to Contribute

1. **Fork the Repository**

   Go to [https://github.com/PKief/vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme) and fork the repository.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/vscode-material-icon-theme.git
   cd vscode-material-icon-theme
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Add the Packship Icon**

   - Copy your `packshiprc.svg` file to the `icons` directory
   - Make sure it follows the style guidelines of the theme

5. **Update the File Icon Definitions**

   Edit `src/icons/fileIcons.ts` and add an entry for `.packshiprc`:

   ```typescript
   { name: 'packship', fileNames: ['.packshiprc'] },
   ```

6. **Build the Extension**

   ```bash
   npm run build
   ```

7. **Test the Extension**

   ```bash
   npm run test
   ```

8. **Submit a Pull Request**

   - Push your changes to your fork
   - Create a pull request to the original repository
   - Provide a clear description of your changes

## Example Pull Request Description

```
Add icon for Packship configuration files

This PR adds support for `.packshiprc` configuration files used by the Packship npm package publishing tool.

Changes:
- Added packship.svg icon
- Added file association for .packshiprc

The Packship tool (https://github.com/CodeNKoffee/packship) is a CLI tool to help ship npm packages faster.
```

## Alternative: File an Issue

If you prefer not to create a pull request yourself, you can file an issue requesting support for `.packshiprc` files:

1. Go to [https://github.com/PKief/vscode-material-icon-theme/issues](https://github.com/PKief/vscode-material-icon-theme/issues)
2. Click "New Issue"
3. Request support for `.packshiprc` files
4. Include a link to the Packship repository and a brief description of what it is 