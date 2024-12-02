import { Command } from 'commander';
import { SpinnakerClient } from '../services/spinnaker-client';
import { Config } from '../types/spinnaker';
import { handleCommandError } from '../utils/error-handling';
import { formatTable } from '../utils/formatting';

export function createDeploymentCommand(config: Config): Command {
  const deployment = new Command('deployment')
    .description('Deployment management commands');

  // List deployments for an application
  deployment.command('list')
    .description('List deployments for an application')
    .argument('<application>', 'Application name')
    .action(async (application: string) => {
      try {
        const client = new SpinnakerClient(config);
        const deployments = await client.listDeployments(application);
        
        // Format deployments as a table
        const tableData = deployments.map(deploy => ({
          Name: deploy.name,
          Account: deploy.account,
          Region: deploy.region,
          Capacity: `${deploy.capacity?.min || 0}/${deploy.capacity?.desired || 0}/${deploy.capacity?.max || 0}`,
          Status: deploy.status || 'N/A'
        }));
        
        console.log(formatTable(tableData));
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  return deployment;
}
