# ⚠️ WORK IN PROGRESS ⚠️

> **Note**: This project is currently a work in progress and is being used to test Claude AI functionality. It is not intended for production use at this time. Features and documentation may be incomplete or subject to major changes.

# SPM CLI

Spinnaker Pipeline Management CLI for use with Cline integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create config:
```bash
mkdir -p ~/.spm
echo '{
  "spinnakerApiUrl": "YOUR_SPINNAKER_API_URL",
  "spinnakerToken": "YOUR_SPINNAKER_TOKEN"
}' > ~/.spm/config.json
```

3. Build and link:
```bash
npm run build
npm link
```

## Usage

```bash
# List pipelines
spm pipeline list

# Execute pipeline
spm pipeline execute PIPELINE_ID --params='{"branch":"main"}'

# List applications
spm app list
```

## Development

```bash
# Watch mode
npm run dev

# Run tests
npm test
