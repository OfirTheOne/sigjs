#!/usr/bin/env node

const { prompt } = require('inquirer');
const { join } = require('path');
const { readFile, writeFile, copy } = require('fs-extra');

const ignoredFiles = [
  'node_modules',
  'package-lock.json',
  'pnpm-lock.yaml',
  '.git',
  '.DS_Store'
];

async function addTailwindToScss(projectPath) {
  const indexScssPath = join(projectPath, 'src/index.scss');
  const tailwindImport = '@use "tailwindcss";\n';
  try {
    const existingContent = await readFile(indexScssPath, 'utf8');
    if (!existingContent.includes(tailwindImport)) {
      await writeFile(indexScssPath, tailwindImport + existingContent);
    } else {
      console.log('Tailwind CSS already present in index.scss');
    }
  } catch (err) {
    console.error('Error adding Tailwind CSS to index.scss:', err);
    throw err;
  }
}

async function addTailwindDependencies(projectPath) {
  const packageJsonPath = join(projectPath, 'package.json');
  try {
    const packageJson = await readFile(packageJsonPath, 'utf8');
    const packageData = JSON.parse(packageJson);

    packageData.devDependencies = {
      ...packageData.devDependencies,
      "tailwindcss": "^4.0.12",
      "@tailwindcss/vite": "^4.0.6",
    };

    await writeFile(packageJsonPath, JSON.stringify(packageData, null, 2));
  } catch (err) {
    console.error('Error adding Tailwind CSS dependencies to package.json:', err);
    throw err;
  }
}

async function createSigJsApp() {
  const answers = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: 'my-sigjs-app'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: 'Base Template', value: 'base' },
        { name: 'Template with Router', value: 'with-router' }
      ],
      default: 'base'
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Do you want to use Tailwind CSS?',
      default: false
    },
    {
      type: 'input',
      name: 'directory',
      message: 'Where do you want to create the project?',
      default: process.cwd()
    }
  ]);

  const projectPath = join(answers.directory, answers.projectName);
  const templatePath = join(__dirname, `../template/${answers.template}`);

  try {
    // Copy template files
    await copy(templatePath, projectPath, {
      filter: (src, dest) => {
        // Include all files, including those starting with a dot
        return !ignoredFiles.some(file => src.endsWith('/' + file));
      }
    });

    // Copy Tailwind CSS files
    if (answers.tailwind) {
      await copy(
        join(__dirname, '../template/tailwind'),
        projectPath,
        {
          filter: (src, dest) => {
            return !ignoredFiles.some(file => src.endsWith('/' + file));
          }
        }
      );
    }

    if (answers.tailwind) {
      const tailwindTemplatePath = join(__dirname, '../template/tailwind');
      await copy(tailwindTemplatePath, projectPath, {
        filter: (src) => {
          const relativePath = src.replace(tailwindTemplatePath, '');
          return !ignoredFiles.some(file => relativePath.includes(file));
        }
      });

      await addTailwindDependencies(projectPath);
      await addTailwindToScss(projectPath);
    }

    console.log('Project created successfully at', projectPath);
  } catch (err) {
    console.error('Error creating project:', err);
  }
}

createSigJsApp();