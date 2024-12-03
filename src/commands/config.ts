import { Command } from 'commander';
import inquirer from 'inquirer';
import { configManager } from '../config';

export const configCommand = new Command('config')
  .description('Configure Spinnaker settings')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'spinnakerApiUrl',
        message: 'Enter your Spinnaker API URL:',
        default: configManager.get().spinnakerApiUrl,
        validate: (input: string) => {
          if (!input) return 'Spinnaker API URL is required';
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'password',
        name: 'spinnakerToken',
        message: 'Enter your Spinnaker service user token:',
        validate: (input: string) => {
          if (!input) return 'Spinnaker token is required';
          return true;
        }
      }
    ]);

    configManager.update(answers);
    console.log('Configuration updated successfully!');
  });
