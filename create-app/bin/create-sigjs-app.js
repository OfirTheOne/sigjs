#!/usr/bin/env node

const { prompt } = require('inquirer');
const { join } = require('path');
const { copy } = require('fs-extra');

const ignoredFiles = [
  'node_modules',
  'package-lock.json',
  'pnpm-lock.yaml',
  '.git',
  '.DS_Store'
];

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

    console.log('Project created successfully at', projectPath);
  } catch (err) {
    console.error('Error creating project:', err);
  }
}

createSigJsApp();