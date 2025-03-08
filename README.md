# Packship Installation Guide

**Packship** is a CLI tool designed to simplify the process of initializing new npm packages. It automates the creation of package directories, configuration files, and more, helping you set up packages faster and with less hassle.

This guide will walk you through installing Packship's dependencies and configuring Webpack.

## 1. Getting Started

### Packship Global Installation

#### For MacOS & Linux

```bash
sudo npm i -g packship@latest
```

#### For Windows

```bash
npm i -g packship@latest
```

---

### Setting Up Your Package with Packship

```bash
packship init
```

Follow the prompts, and your package will be ready!

> **Note:** For the best experience, we recommend initializing your packages with `packship init`. While you can use `packship publish` with any npm package, packages initialized with Packship will have access to optimized workflows and features.

## 2. Dependency Installation

### Initialize `node modules` and `package-lock.json`

Install the necessary dependencies to ensure your package runs smoothly.

```bash
npm install
```

If you encounter dependency resolution issues, similar to this:

![Image Title](./src/assets/dep-res-issue.png)

Run the following command to install dependencies:

```bash
npm install --legacy-peer-deps
```

If you see an EACCES error, run the following command to fix permissions:

![Image Title](./src/assets/eas-issue.png)

```bash
sudo chown -R $(whoami) "$(npm config get cache)"
```

Then, try installing the dependencies again:

```bash
npm install
```

If you encounter deprecated package warnings, you can safely ignore them or update the packages as needed.

Install the necessary dependencies to avoid redundancy and ensure proper package setup.

### Main Dependencies

#### For TypeScript

```bash
npm install --save typescript @types/react @types/react-dom
```

#### For JavaScript

```bash
npm install react react-dom
```

Make sure TypeScript and React typings are installed for development purposes. Install these commands only once to avoid duplication.

---

### Babel for React & TypeScript

Install Babel presets to compile TypeScript and JSX/React syntax:

#### For TypeScript

```bash
npm install --save-dev @babel/preset-typescript @babel/preset-react
```

#### For JavaScript

```bash
npm install --save-dev @babel/preset-react
```

---

### Babel & Webpack Loaders

Install the necessary loaders for Babel and Webpack:

```bash
npm install --save-dev babel-loader webpack
```

These loaders ensure that Webpack and Babel can work together to transpile and bundle your code.

## 3. Publishing Your Npm Package

To publish your package, ensure the build is successful:

```bash
npm run build
```

### For New Packages

Once the build succeeds, publish your package:

```bash
packship publish
```

### For Existing Packages

If you're updating an existing package, update the version and then publish:

```bash
npm version patch/minor/major      # Depending on your release
```

Then:

```bash
packship publish
```

## 4. Reporting Issues with Packship

If you encounter any issues with the Packship tool itself, you can report them directly from the terminal:

```bash
packship report
```

This command is specifically for reporting issues with the Packship CLI tool, not for issues with your npm package. It will guide you through a series of prompts to collect information about the issue with Packship.

If you don't have a GitHub token set up, the command will offer you the option to enter one directly in the terminal and save it for future use.

You can also set a GitHub token as an environment variable beforehand:

```bash
export GITHUB_TOKEN=your_github_token
```

If you choose not to provide a token, the command will show you steps for manual submission with pre-formatted content.

## Telemetry

PackShip collects anonymous usage data to help improve the tool. This data includes command usage and error rates, but never includes personal information or code. You can opt out at any time by running:

```bash
packship telemetry disable
```

To check the current telemetry status:

```bash
packship telemetry status
```

To re-enable telemetry:

```bash
packship telemetry enable
```

The telemetry system only tracks essential commands like `packship init` and `packship publish` to conserve tracking resources.

## Contributing

We welcome contributions to PackShip! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
