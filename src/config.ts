// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const APP_VERSION = process.env.npm_package_version || '0.1.0';
export const APP_ENV = process.env.NODE_ENV || 'development';

// Constants
export const AUTH_BASE_URL = 'https://auth-lawma-api-dev-hxezgrckc9hrfcaj.westus2-01.azurewebsites.net/api/v1';
export let API_BASE_URL: string | null = null;
export let WS_BASE_URL: string | null = null;

// Token management
export let ACCESS_TOKEN: string | null = null;
let API_KEY: string | null = null;

// Monitoring configuration
export const SENTRY_DSN = 'https://5dd6d94215e099545cd9452d754be448@o4509246826151936.ingest.us.sentry.io/4509246857347072';
export const MIXPANEL_TOKEN = '94405fc3e3651e3c571356024d2ff2f4';

export interface InitResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  authorized_urls: string[];
}

// Update config with initial auth response
export const updateConfig = (initResponse: InitResponse) => {
  let baseUrl = initResponse.authorized_urls[0];
  // Replace 0.0.0.0:8002 with localhost:8002 for better browser compatibility
  if (baseUrl.includes('0.0.0.0:8002')) {
    baseUrl = baseUrl.replace('0.0.0.0:8002', 'localhost:8002');
  }
  API_BASE_URL = baseUrl;
  WS_BASE_URL = API_BASE_URL.replace('http', 'ws');
  ACCESS_TOKEN = initResponse.token.access_token;
};

// Store API key for token refresh
export const setApiKey = (apiKey: string) => {
  API_KEY = apiKey;
};

// Get stored API key
export const getApiKey = () => API_KEY;
