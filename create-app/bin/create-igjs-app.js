#!/usr/bin/env node

import { copy } from 'fs-extra';
import { join } from 'path';
import { prompt } from 'inquirer';

async function createSigJsApp() {
  const answers = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: 'my-sigjs-app'
    }
  ]);

  const projectPath = join(process.cwd(), answers.projectName);
  const templatePath = join(__dirname, '../sigjs-template');

  try {
    await copy(templatePath, projectPath);
    console.log('Project created successfully!');
  } catch (err) {
    console.error('Error creating project:', err);
  }
}

createSigJsApp();