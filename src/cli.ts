#!/usr/bin/env node
import { Command } from 'commander';
import { SpinnakerClient } from './client';

const program = new Command();

program
  .name('spm')
  .description('Spinnaker Pipeline Management CLI')
  .version('0.1.0');

// Pipeline commands
program.command('pipeline')
  .description('Pipeline management commands')
  .addCommand(
    new Command('list')
      .description('List all pipelines')
      .option('-a, --application <name>', 'Filter by application name')
      .action(async (options) => {
        const client = new SpinnakerClient();
        const pipelines = await client.listPipelines(options.application);
        console.table(pipelines.map(p => ({
          id: p.id,
          name: p.name,
          application: p.application,
          status: p.status
        })));
      })
  )
  .addCommand(
    new Command('execute')
      .description('Execute a pipeline')
      .argument('<id>', 'Pipeline ID')
      .option('-p, --params <json>', 'Pipeline parameters as JSON')
      .action(async (id, options) => {
        const client = new SpinnakerClient();
        const params = options.params ? JSON.parse(options.params) : {};
        await client.executePipeline(id, params);
        console.log(`Pipeline ${id} execution started`);
      })
  )
  .addCommand(
    new Command('stop')
      .description('Stop a pipeline execution')
      .argument('<id>', 'Pipeline execution ID')
      .action(async (id) => {
        const client = new SpinnakerClient();
        await client.stopPipeline(id);
        console.log(`Pipeline execution ${id} stopped`);
      })
  );

// Application commands  
program.command('app')
  .description('Application management commands')
  .addCommand(
    new Command('list')
      .description('List all applications')
      .action(async () => {
        const client = new SpinnakerClient();
        const apps = await client.listApplications();
        console.table(apps.map(a => ({
          name: a.name,
          email: a.email,
          pipelineCount: a.pipelineConfigs?.length || 0
        })));
      })
  )
  .addCommand(
    new Command('deployments')
      .description('List deployments for an application')
      .argument('<name>', 'Application name')
      .action(async (name) => {
        const client = new SpinnakerClient();
        const deployments = await client.listDeployments(name);
        console.table(deployments);
      })
  );

program.parse();