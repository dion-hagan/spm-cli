import fs from 'fs';
import path from 'path';
import os from 'os';

interface Config {
  spinnakerApiUrl: string;
  spinnakerToken: string;
}

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
}

export const config = new ConfigManager().get();