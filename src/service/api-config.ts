import { Platform } from 'react-native';

const API_PORT = 8080;

const LOCAL_API_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
});

export const API_BASE_URL = `http://${LOCAL_API_HOST}:${API_PORT}`;

export const API_TIMEOUT_IN_MS = 10000;
