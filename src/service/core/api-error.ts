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
  if (isApiError(error)) {
    return error;
  }

  if (isAxiosError(error)) {
    if (error.response) {
      const serverErrorMessage = getFirstAvailableServerErrorMessage([
        error.response.data,
        getRawResponseBody(error.response.request),
        getRawResponseBody(error.request),
      ]);

      return {
        message: serverErrorMessage ?? error.message ?? DEFAULT_ERROR_MESSAGE,
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

function isApiError(error: unknown): error is ApiError {
  if (isAxiosError(error)) {
    return false;
  }

  return Boolean(
    error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.trim()
  );
}

function getFirstAvailableServerErrorMessage(values: unknown[]): string | undefined {
  for (const value of values) {
    const message = getServerErrorMessage(value);

    if (message) {
      return message;
    }
  }

  return undefined;
}

function getRawResponseBody(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  return (value as Record<string, unknown>)._response;
}

function getServerErrorMessage(data: unknown): string | undefined {
  const resolvedData = resolveServerErrorData(data);

  if (typeof resolvedData === 'string' && resolvedData.trim()) {
    return resolvedData;
  }

  if (!resolvedData || typeof resolvedData !== 'object') {
    return undefined;
  }

  const dataRecord = resolvedData as Record<string, unknown>;
  const primaryMessage =
    getNonEmptyString(dataRecord.message) ?? getNonEmptyString(dataRecord.error);
  const fieldMessages = getFieldMessages(dataRecord.errors);

  if (primaryMessage && fieldMessages.length > 0) {
    return `${primaryMessage}\n\n${fieldMessages.map((message) => `- ${message}`).join('\n')}`;
  }

  if (fieldMessages.length > 0) {
    return fieldMessages.map((message) => `- ${message}`).join('\n');
  }

  return primaryMessage;
}

function resolveServerErrorData(data: unknown): unknown {
  if (typeof data === 'string' && data.trim()) {
    return tryParseJson(data) ?? data;
  }

  return data;
}

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return undefined;
}

function getFieldMessages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const itemRecord = item as Record<string, unknown>;
      const message = getNonEmptyString(itemRecord.message);

      if (!message) {
        return null;
      }

      return message;
    })
    .filter((message): message is string => Boolean(message));
}

function tryParseJson(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
