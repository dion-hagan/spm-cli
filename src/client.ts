import axios from 'axios';
import { config } from './config';

interface Pipeline {
  id: string;
  name: string;
  application: string;
  status: string;
}

interface Application {
  name: string;
  email: string;
  pipelineConfigs?: any[];
}

export class SpinnakerClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = config.spinnakerApiUrl;
    this.headers = {
      'Authorization': `Bearer ${config.spinnakerToken}`,
      'Content-Type': 'application/json'
    };
  }

  async listPipelines(application?: string): Promise<Pipeline[]> {
    const url = application 
      ? `${this.baseUrl}/applications/${application}/pipelines`
      : `${this.baseUrl}/pipelines`;
    const response = await axios.get(url, { headers: this.headers });
    return response.data;
  }

  async executePipeline(id: string, params: object = {}): Promise<void> {
    await axios.post(
      `${this.baseUrl}/pipelines/${id}`, 
      params,
      { headers: this.headers }
    );
  }

  async stopPipeline(executionId: string): Promise<void> {
    await axios.put(
      `${this.baseUrl}/pipelines/${executionId}/cancel`,
      {},
      { headers: this.headers }
    );
  }

  async listApplications(): Promise<Application[]> {
    const response = await axios.get(
      `${this.baseUrl}/applications`, 
      { headers: this.headers }
    );
    return response.data;
  }

  async listDeployments(application: string): Promise<any[]> {
    const response = await axios.get(
      `${this.baseUrl}/applications/${application}/serverGroups`,
      { headers: this.headers }
    );
    return response.data;
  }
}