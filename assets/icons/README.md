# Packship Icons

This directory contains icons for the Packship tool and its configuration files.

## Icons

- `packshiprc.svg` - 16x16 icon for `.packshiprc` files
- `packshiprc-128.svg` - 128x128 icon for larger displays

## How to Use These Icons

### For VS Code

To get custom icons for `.packshiprc` files in VS Code, you have two options:

#### Option 1: Use a Popular Icon Theme

1. Install one of these popular icon themes:
   - [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
   - [VSCode Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
   - [Seti Icons](https://marketplace.visualstudio.com/items?itemName=qinjia.seti-icons)

2. Request support for `.packshiprc` files by:
   - Opening an issue in their GitHub repository
   - Contributing a pull request with the Packship icon

#### Option 2: Create Your Own Icon Theme Extension

1. Install the necessary tools:
   ```bash
   npm install -g yo generator-code vsce
   ```

2. Generate a new extension:
   ```bash
   yo code
   ```
   - Choose "New File Icon Theme" when prompted
   - Name it something like "packship-icons"

3. Add the Packship icons to your extension:
   - Copy the SVG files to the `icons` directory
   - Configure the `fileIcons.json` file to include `.packshiprc` files

4. Publish your extension to the VS Code Marketplace.

### For Other IDEs

Different IDEs have different ways of supporting custom file icons:

- **WebStorm/IntelliJ**: Use the [Atom Material Icons](https://plugins.jetbrains.com/plugin/10044-atom-material-icons) plugin
- **Atom**: Use the [File Icons](https://atom.io/packages/file-icons) package
- **Sublime Text**: Use the [A File Icon](https://packagecontrol.io/packages/A%20File%20Icon) package

## Converting to Other Formats

To convert these SVG icons to other formats:

### PNG

```bash
# Install Inkscape if you don't have it
brew install inkscape

# Convert to PNG
inkscape -w 16 -h 16 packshiprc.svg -o packshiprc-16.png
inkscape -w 32 -h 32 packshiprc.svg -o packshiprc-32.png
inkscape -w 128 -h 128 packshiprc-128.svg -o packshiprc-128.png
```

### ICO (Windows Icon)

```bash
# Install ImageMagick if you don't have it
brew install imagemagick

# Convert to ICO
convert packshiprc-16.png packshiprc-32.png packshiprc-128.png packshiprc.ico
``` 