# SPM CLI

Spinnaker Pipeline Management CLI - A command-line tool for managing Spinnaker pipelines, applications, and deployments.

## Installation

```bash
npm install -g @airjesus17/spm-cli
```

## Configuration

Use the config command to set up your Spinnaker credentials:

```bash
spm config
```

This will prompt you for:
- Spinnaker API URL
- Spinnaker service user token

Configuration is stored in `~/.spm/config.json`

## Commands

### Pipeline Management

```bash
# List all pipelines
spm pipeline list
# Filter pipelines by application
spm pipeline list -a <application-name>

# Execute a pipeline
spm pipeline execute <application> <pipeline-name>
# Execute with parameters
spm pipeline execute <application> <pipeline-name> -p '{"branch":"main"}'

# Stop a pipeline execution
spm pipeline stop <execution-id>

# Watch a pipeline execution
spm pipeline watch <execution-id>
```

### Application Management

```bash
# List all applications
spm app list

# Get detailed information about an application
spm app get <application-name>
```

### Deployment Management

```bash
# List deployments for an application
spm deployment list <application-name>
```

### Configuration

```bash
# Configure Spinnaker settings
spm config
```

## Command Details

### Pipeline Commands

- `pipeline list`: Lists all pipelines or filters by application
  - Options:
    - `-a, --application <name>`: Filter by application name

- `pipeline execute`: Executes a pipeline
  - Arguments:
    - `<application>`: Application name
    - `<pipeline>`: Pipeline name
  - Options:
    - `-p, --params <json>`: Pipeline parameters as JSON

- `pipeline stop`: Stops a running pipeline execution
  - Arguments:
    - `<id>`: Pipeline execution ID

- `pipeline watch`: Watches a pipeline execution in real-time
  - Arguments:
    - `<id>`: Pipeline execution ID
  - Shows progress and stage status updates

### Application Commands

- `app list`: Lists all applications
  - Displays: Name, Email, Description, Status

- `app get`: Gets detailed information about an application
  - Arguments:
    - `<name>`: Application name
  - Shows: Name, Email, Description, Status, Cloud Providers, Instance Port

### Deployment Commands

- `deployment list`: Lists deployments for an application
  - Arguments:
    - `<application>`: Application name
  - Displays: Name, Account, Region, Capacity (min/desired/max), Status

### Config Command

- `config`: Interactive configuration setup
  - Prompts for:
    - Spinnaker API URL
    - Spinnaker service user token
  - Validates and stores configuration

## Development

```bash
# Clone the repository
git clone https://github.com/dion-hagan/spm-cli.git
cd spm-cli

# Install dependencies
npm install

# Watch mode for development
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Notes

- All commands validate configuration before execution
- JSON parameters must be properly formatted
- Watch command provides real-time updates of pipeline execution
- Configuration is stored securely in the user's home directory
