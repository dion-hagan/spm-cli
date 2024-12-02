# SPM CLI Features

| Command | Description | Example | Notes |
|---------|-------------|---------|-------|
| `spm pipeline list` | Lists all pipelines across all applications | `spm pipeline list` | Shows ID, name, application, and status |
| `spm pipeline list -a <app>` | Lists pipelines for a specific application | `spm pipeline list -a my-service` | Filter to see only pipelines for one app |
| `spm pipeline execute <id>` | Triggers a pipeline execution | `spm pipeline execute abc123` | Basic execution with no parameters |
| `spm pipeline execute <id> --params '{"json"}'` | Triggers pipeline with parameters | `spm pipeline execute abc123 --params '{"branch":"main","env":"prod"}'` | Pass any JSON params your pipeline accepts |
| `spm pipeline stop <id>` | Cancels a running pipeline | `spm pipeline stop abc123` | Useful for stopping problematic deployments |
| `spm app list` | Lists all Spinnaker applications | `spm app list` | Shows name, email, and pipeline count |
| `spm app deployments <name>` | Shows deployments for an app | `spm app deployments my-service` | Lists all server groups/deployments |

## Config Setup

The CLI reads config from `~/.spm/config.json`:
```json
{
  "spinnakerApiUrl": "https://your-spinnaker-gate.example.com",
  "spinnakerToken": "your-bearer-token"
}
```

## Integration with Cline

When used with Cline, you can:
1. Execute commands directly from VSCode using Cline's terminal integration
2. Have Cline analyze pipeline output and suggest fixes
3. Use natural language to manage pipelines (e.g., "deploy the main branch to production")

## Common Use Cases

1. **Pipeline Management**
   - Quick pipeline status checks
   - Automated deployments
   - Emergency stops for bad deployments

2. **Application Overview**
   - Monitor all applications
   - Track deployment states
   - Quick access to configuration

3. **Automation & Integration**
   - CI/CD automation
   - Custom scripts integration
   - VSCode/Cline integration