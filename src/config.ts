import fs from 'fs';
import path from 'path';
import os from 'os';
import { Config } from './types/spinnaker';

class ConfigManager {
  private configPath: string;
  private config: Config;

  constructor() {
    this.configPath = path.join(os.homedir(), '.spm', 'config.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      if (!fs.existsSync(this.configPath)) {
        this.initConfig();
      }
      const configData = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Error loading config:', error);
      process.exit(1);
    }
  }

  private initConfig() {
    const defaultConfig: Config = {
      spinnakerApiUrl: process.env.SPINNAKER_API_URL || '',
      spinnakerToken: process.env.SPINNAKER_TOKEN || ''
    };

    const dirPath = path.dirname(this.configPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(
      this.configPath, 
      JSON.stringify(defaultConfig, null, 2)
    );
  }

  get(): Config {
    return this.config;
  }

  update(newConfig: Partial<Config>): void {
    this.config = { ...this.config, ...newConfig };
    const dirPath = path.dirname(this.configPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(
      this.configPath,
      JSON.stringify(this.config, null, 2)
    );
  }

  validate(): boolean {
    return Boolean(
      this.config.spinnakerApiUrl &&
      this.config.spinnakerToken
    );
  }

  validateOrExit(): void {
    if (!this.validate()) {
      console.error('Invalid configuration. Please run "spm config" to set up your configuration.');
      process.exit(1);
    }
  }
}

// Export singleton instance
export const configManager = new ConfigManager();
export const config = configManager.get();

// Export loadConfig function for CLI
export async function loadConfig(): Promise<Config> {
  configManager.validateOrExit();
  return config;
}
