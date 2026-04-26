import axios from 'axios';

import { API_BASE_URL, API_TIMEOUT_IN_MS } from './api-config';
import { setupApiInterceptors } from './api-interceptors';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_IN_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

setupApiInterceptors(api);
