// Types representing Spinnaker's core domain objects. These shape our interactions
// with the Spinnaker API and help ensure type safety throughout the application.

export interface Pipeline {
  id: string;
  name: string;
  application: string;
  status: string;
  triggers?: PipelineTrigger[];
  stages?: PipelineStage[];
}

export interface PipelineTrigger {
  type: string;
  enabled: boolean;
  // Additional trigger-specific fields would go here
}

export interface PipelineStage {
  refId: string;
  type: string;
  name: string;
  requisiteStageRefIds: string[];
  // Additional stage-specific fields would go here
}

export interface Application {
  name: string;
  email: string;
  description?: string;
  status?: string;
  cloudProviders?: string[];
  instancePort?: number;
  pipelineConfigs?: Pipeline[];
}

export interface ServerGroup {
  name: string;
  region: string;
  account: string;
  status?: string;
  capacity?: {
    min: number;
    desired: number;
    max: number;
  };
}

// Configuration types for our CLI tool
export interface Config {
  spinnakerApiUrl: string;
  spinnakerToken: string;
}

export interface PipelineExecutionParams {
  [key: string]: any;
}
