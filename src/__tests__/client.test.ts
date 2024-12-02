import axios from 'axios';
import { SpinnakerClient } from '../client';
import { config } from '../config';

jest.mock('axios');
jest.mock('../config', () => ({
  config: {
    spinnakerApiUrl: 'http://test-spinnaker.com',
    spinnakerToken: 'test-token'
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SpinnakerClient', () => {
  let client: SpinnakerClient;

  beforeEach(() => {
    client = new SpinnakerClient();
    jest.clearAllMocks();
  });

  describe('listPipelines', () => {
    it('should fetch all pipelines when no application is specified', async () => {
      const mockPipelines = [{ id: '1', name: 'test', application: 'app', status: 'running' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockPipelines });

      const result = await client.listPipelines();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-spinnaker.com/pipelines',
        expect.any(Object)
      );
      expect(result).toEqual(mockPipelines);
    });

    it('should fetch pipelines for specific application when provided', async () => {
      const mockPipelines = [{ id: '1', name: 'test', application: 'app1', status: 'running' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockPipelines });

      const result = await client.listPipelines('app1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-spinnaker.com/applications/app1/pipelines',
        expect.any(Object)
      );
      expect(result).toEqual(mockPipelines);
    });
  });

  describe('executePipeline', () => {
    it('should execute pipeline with provided params', async () => {
      const pipelineId = 'test-123';
      const params = { branch: 'main' };
      
      await client.executePipeline(pipelineId, params);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://test-spinnaker.com/pipelines/${pipelineId}`,
        params,
        expect.any(Object)
      );
    });
  });

  describe('stopPipeline', () => {
    it('should stop running pipeline', async () => {
      const executionId = 'exec-123';
      
      await client.stopPipeline(executionId);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `http://test-spinnaker.com/pipelines/${executionId}/cancel`,
        {},
        expect.any(Object)
      );
    });
  });

  describe('listApplications', () => {
    it('should fetch all applications', async () => {
      const mockApps = [{ name: 'app1', email: 'test@test.com' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockApps });

      const result = await client.listApplications();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://test-spinnaker.com/applications',
        expect.any(Object)
      );
      expect(result).toEqual(mockApps);
    });
  });
});