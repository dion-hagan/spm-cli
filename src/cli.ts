#!/usr/bin/env node
import { Command } from 'commander';
import { createPipelineCommand } from './commands/pipeline';
import { createApplicationCommand } from './commands/application';
import { createDeploymentCommand } from './commands/deployment';
import { configCommand } from './commands/config';
import { configManager } from './config';

async function main() {
  const program = new Command();
  const config = configManager.get();

  program
    .name('spm')
    .description('Spinnaker Pipeline Management CLI')
    .version('0.1.0');

  // Add config command
  program.addCommand(configCommand);

  // Add commands with aliases
  const pipelineCmd = createPipelineCommand(config);
  pipelineCmd.alias('p');
  program.addCommand(pipelineCmd);

  const appCmd = createApplicationCommand(config);
  appCmd.alias('a');
  program.addCommand(appCmd);

  const deploymentCmd = createDeploymentCommand(config);
  deploymentCmd.alias('d');
  program.addCommand(deploymentCmd);

  // Add pre-command validation hook for all commands except config
  program.hook('preAction', (thisCommand) => {
    if (thisCommand.name() !== 'config') {
      configManager.validateOrExit();
    }
  });

  await program.parseAsync();
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
