# Packship

**Packship** is a CLI tool designed to simplify the process of initializing new npm packages. It automates the creation of package directories, configuration files, and more, helping you set up packages faster and with less hassle.

## Features

- Initializes a new npm package with a pre-configured setup
- Generates essential files like `package.json`, `README.md`, `.gitignore`, and more
- Easy to use with a command-line interface

## Installation

To install `packship` globally, run:

```bash
npm install -g packship
```

Alternatively, you can use it with npx without installing globally:

```bash
npx -y packship
```

## Usage

To initialize a new npm package, navigate to your desired directory and run:

```bash
npx -y packship init
```

You will be prompted to enter details such as the package name, version, and description. After providing these details, packship will create a new directory with the specified package name and generate the following files of your choice

### Example

```bash
$ npx -y packship init
Package Name: my-awesome-package
Initial Version: 1.0.0
Package Description: A brief description of my awesome package

Initialized new npm package in /path/to/my-awesome-package
```

## Plop Templates

The `packship` tool uses Plop for generating files based on templates. You can customize these templates to fit your project’s needs.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to contribute to the packship project.

## License

This project is licensed under the ISC License. See the LICENSE file for details.
