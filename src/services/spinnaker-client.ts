import axios, { AxiosInstance } from 'axios';
import { Config, Pipeline, Application, ServerGroup, PipelineExecutionParams } from '../types/spinnaker';
import { handleApiError } from '../utils/error-handling';

// SpinnakerClient handles all interactions with the Spinnaker API.
// It encapsulates the complexity of making HTTP requests and handling responses,
// providing a clean interface for the rest of the application.
export class SpinnakerClient {
  private readonly client: AxiosInstance;

  constructor(private readonly config: Config) {
    // Create an axios instance with pre-configured headers and base URL
    this.client = axios.create({
      baseURL: config.spinnakerApiUrl,
      headers: {
        'Authorization': `Bearer ${config.spinnakerToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => handleApiError(error)
    );
  }

  // Pipeline Management
  async listPipelines(application?: string): Promise<Pipeline[]> {
    const url = application 
      ? `/applications/${application}/pipelines`
      : '/pipelines';
    
    const response = await this.client.get(url);
    return response.data;
  }

  async executePipeline(id: string, params: PipelineExecutionParams = {}): Promise<void> {
    await this.client.post(`/pipelines/${id}`, params);
  }

  async stopPipeline(executionId: string): Promise<void> {
    await this.client.put(`/pipelines/${executionId}/cancel`, {});
  }

  async getPipelineStatus(executionId: string): Promise<Pipeline> {
    const response = await this.client.get(`/pipelines/${executionId}`);
    return response.data;
  }

  // Application Management
  async listApplications(): Promise<Application[]> {
    const response = await this.client.get('/applications');
    return response.data;
  }

  async getApplication(name: string): Promise<Application> {
    const response = await this.client.get(`/applications/${name}`);
    return response.data;
  }

  // Deployment Management
  async listDeployments(application: string): Promise<ServerGroup[]> {
    const response = await this.client.get(
      `/applications/${application}/serverGroups`
    );
    return response.data;
  }

  // Pipeline Execution Monitoring
  async watchPipelineExecution(executionId: string, callback: (pipeline: Pipeline) => void): Promise<void> {
    let isRunning = true;
    while (isRunning) {
      const pipeline = await this.getPipelineStatus(executionId);
      callback(pipeline);
      
      isRunning = ['RUNNING', 'NOT_STARTED', 'PAUSED'].includes(pipeline.status);
      if (isRunning) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }
    }
  }
}