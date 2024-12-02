import { Command } from 'commander';
import { SpinnakerClient } from '../services/spinnaker-client';
import { Config } from '../types/spinnaker';
import { handleCommandError } from '../utils/error-handling';
import { formatTable } from '../utils/formatting';

export function createApplicationCommand(config: Config): Command {
  const application = new Command('app')
    .description('Application management commands');

  // List applications
  application.command('list')
    .description('List all applications')
    .action(async () => {
      try {
        const client = new SpinnakerClient(config);
        const applications = await client.listApplications();
        
        // Format applications as a table
        const tableData = applications.map(app => ({
          Name: app.name,
          Email: app.email || 'N/A',
          Description: app.description || 'N/A',
          Status: app.status || 'N/A'
        }));
        
        console.log(formatTable(tableData));
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  // Get application details
  application.command('get')
    .description('Get application details')
    .argument('<name>', 'Application name')
    .action(async (name) => {
      try {
        const client = new SpinnakerClient(config);
        const app = await client.getApplication(name);
        
        // Format application details
        console.log('\nApplication Details:');
        console.log('==================');
        console.log(`Name: ${app.name}`);
        console.log(`Email: ${app.email || 'N/A'}`);
        console.log(`Description: ${app.description || 'N/A'}`);
        console.log(`Status: ${app.status || 'N/A'}`);
        
        if (app.cloudProviders?.length) {
          console.log(`Cloud Providers: ${app.cloudProviders.join(', ')}`);
        }
        
        if (app.instancePort) {
          console.log(`Instance Port: ${app.instancePort}`);
        }
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  return application;
}
