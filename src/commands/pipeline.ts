import { Command } from 'commander';
import { SpinnakerClient } from '../services/spinnaker-client';
import { Config } from '../types/spinnaker';
import { handleCommandError } from '../utils/error-handling';
import { formatPipelineList, formatProgress } from '../utils/formatting';

// Creates and configures the pipeline command group
export function createPipelineCommand(config: Config): Command {
  const pipeline = new Command('pipeline')
    .description('Pipeline management commands');

  // List pipelines
  pipeline.command('list')
    .description('List all pipelines')
    .option('-a, --application <name>', 'Filter by application name')
    .action(async (options) => {
      try {
        const client = new SpinnakerClient(config);
        const pipelines = await client.listPipelines(options.application);
        console.log(formatPipelineList(pipelines));
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  // Execute pipeline
  pipeline.command('execute')
    .description('Execute a pipeline')
    .argument('<id>', 'Pipeline ID')
    .option('-p, --params <json>', 'Pipeline parameters as JSON')
    .action(async (id, options) => {
      try {
        const client = new SpinnakerClient(config);
        const params = options.params ? JSON.parse(options.params) : {};
        await client.executePipeline(id, params);
        console.log(`Pipeline ${id} execution started`);
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  // Stop pipeline
  pipeline.command('stop')
    .description('Stop a pipeline execution')
    .argument('<id>', 'Pipeline execution ID')
    .action(async (id) => {
      try {
        const client = new SpinnakerClient(config);
        await client.stopPipeline(id);
        console.log(`Pipeline execution ${id} stopped`);
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  // Watch pipeline execution
  pipeline.command('watch')
    .description('Watch a pipeline execution')
    .argument('<id>', 'Pipeline execution ID')
    .action(async (id) => {
      try {
        const client = new SpinnakerClient(config);
        console.log(`Watching pipeline execution ${id}...`);
        
        await client.watchPipelineExecution(id, (pipeline) => {
          process.stdout.write('\x1Bc'); // Clear console
          console.log(formatPipelineList([pipeline]));
          
          if (pipeline.stages) {
            const completed = pipeline.stages.filter(s => s.status === 'SUCCEEDED').length;
            const total = pipeline.stages.length;
            console.log('\nProgress:');
            console.log(formatProgress(completed, total));
          }
        });
      } catch (error) {
        handleCommandError(error as Error);
      }
    });

  return pipeline;
}