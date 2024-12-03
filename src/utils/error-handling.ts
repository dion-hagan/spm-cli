import { AxiosError } from 'axios';
import chalk from 'chalk';

// Custom error class for Spinnaker-specific errors
export class SpinnakerError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'SpinnakerError';
  }
}

interface SpinnakerErrorResponse {
  message?: string;
  [key: string]: any;
}

// Handles API errors and transforms them into user-friendly messages
export function handleApiError(error: AxiosError): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    const details = error.response.data as SpinnakerErrorResponse;
    
    let message = `Spinnaker API Error (${statusCode}): `;
    
    if (details && typeof details === 'object' && 'message' in details) {
      message += details.message;
    } else if (typeof details === 'string') {
      message += details;
    } else {
      message += 'Unknown error occurred';
    }

    throw new SpinnakerError(message, statusCode, details);
  } else if (error.request) {
    // The request was made but no response was received
    throw new SpinnakerError(
      'No response received from Spinnaker. Please check your network connection and API endpoint.'
    );
  } else {
    // Something happened in setting up the request
    throw new SpinnakerError(
      `Error setting up request: ${error.message}`
    );
  }
}

// Formats error messages for CLI output
export function formatErrorMessage(error: Error): string {
  if (error instanceof SpinnakerError) {
    const lines = [
      chalk.red.bold('Error: ') + error.message
    ];

    if (error.details) {
      lines.push(
        '',
        chalk.yellow('Details:'),
        JSON.stringify(error.details, null, 2)
      );
    }

    return lines.join('\n');
  }

  return chalk.red.bold('Error: ') + error.message;
}

// Central error handler for CLI commands
export function handleCommandError(error: Error): void {
  console.error(formatErrorMessage(error));
  process.exit(1);
}
