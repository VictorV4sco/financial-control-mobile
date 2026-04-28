import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { normalizeApiError } from './api-error';

function onRequest(config: InternalAxiosRequestConfig) {
  return config;
}

function onRequestError(error: unknown) {
  return Promise.reject(normalizeApiError(error));
}

function onResponse<T>(response: T) {
  return response;
}

function onResponseError(error: unknown) {
  return Promise.reject(normalizeApiError(error));
}

export function setupApiInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(onRequest, onRequestError);
  api.interceptors.response.use(onResponse, onResponseError);
}
