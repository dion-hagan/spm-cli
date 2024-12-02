import chalk from 'chalk';
import { Pipeline, Application, ServerGroup } from '../types/spinnaker';

// Provides consistent styling for CLI output across all commands

export function formatPipeline(pipeline: Pipeline): string {
  const status = formatStatus(pipeline.status);
  return `${chalk.bold(pipeline.name)} (${pipeline.id})
  Application: ${chalk.blue(pipeline.application)}
  Status: ${status}`;
}

export function formatPipelineList(pipelines: Pipeline[]): string {
  if (pipelines.length === 0) {
    return chalk.yellow('No pipelines found.');
  }

  return pipelines
    .map(p => formatPipeline(p))
    .join('\n\n');
}

export function formatApplication(app: Application): string {
  const pipelineCount = app.pipelineConfigs?.length ?? 0;
  return `${chalk.bold(app.name)}
  Email: ${app.email}
  Pipelines: ${pipelineCount}`;
}

export function formatApplicationList(apps: Application[]): string {
  if (apps.length === 0) {
    return chalk.yellow('No applications found.');
  }

  return apps
    .map(a => formatApplication(a))
    .join('\n\n');
}

export function formatServerGroup(group: ServerGroup): string {
  return `${chalk.bold(group.name)}
  Region: ${group.region}
  Account: ${group.account}`;
}

export function formatServerGroupList(groups: ServerGroup[]): string {
  if (groups.length === 0) {
    return chalk.yellow('No deployments found.');
  }

  return groups
    .map(g => formatServerGroup(g))
    .join('\n\n');
}

function formatStatus(status: string): string {
  const colors: { [key: string]: Function } = {
    'SUCCEEDED': chalk.green,
    'RUNNING': chalk.blue,
    'FAILED': chalk.red,
    'CANCELED': chalk.yellow,
    'NOT_STARTED': chalk.gray,
    'PAUSED': chalk.yellow,
  };

  const colorFn = colors[status] || chalk.white;
  return colorFn(status);
}

export function formatProgress(current: number, total: number): string {
  const percent = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
  return `${bar} ${percent}%`;
}

export function formatTable(data: Record<string, any>[]): string {
  if (data.length === 0) {
    return chalk.yellow('No data to display.');
  }

  // Get all column names
  const columns = Object.keys(data[0]);
  
  // Calculate column widths
  const columnWidths = columns.reduce((acc, col) => {
    const values = data.map(row => String(row[col] || ''));
    acc[col] = Math.max(
      col.length,
      ...values.map(v => v.length)
    );
    return acc;
  }, {} as Record<string, number>);

  // Create header row
  const header = columns.map(col => 
    chalk.bold(col.padEnd(columnWidths[col]))
  ).join(' | ');

  // Create separator line
  const separator = columns.map(col =>
    '─'.repeat(columnWidths[col])
  ).join('─┼─');

  // Create data rows
  const rows = data.map(row =>
    columns.map(col =>
      String(row[col] || '').padEnd(columnWidths[col])
    ).join(' | ')
  );

  // Combine all parts
  return [
    header,
    separator,
    ...rows
  ].join('\n');
}
