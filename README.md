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
npx -y packship init
```

Follow the prompts, and your package will be ready!

## 2. Dependency Installation

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

If you’re updating an existing package, update the version and then publish:

```bash
npm version patch/minor/major      # Depending on your release
```

Then:

```bash
packship publish
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.
