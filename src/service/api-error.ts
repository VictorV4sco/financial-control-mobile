import { isAxiosError } from 'axios';

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

const DEFAULT_ERROR_MESSAGE = 'An unexpected error happened. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection.';

export function normalizeApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    if (error.response) {
      return {
        message: getServerErrorMessage(error.response.data) ?? error.message ?? DEFAULT_ERROR_MESSAGE,
        status: error.response.status,
        code: error.code,
        details: error.response.data,
      };
    }

    if (error.request) {
      return {
        message: NETWORK_ERROR_MESSAGE,
        code: error.code,
      };
    }

    return {
      message: error.message ?? DEFAULT_ERROR_MESSAGE,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
  };
}

function getServerErrorMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return undefined;
  }

  if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if ('error' in data && typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return undefined;
}
