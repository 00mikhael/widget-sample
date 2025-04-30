// Constants
export const AUTH_BASE_URL = 'https://auth-lawma-api-dev-hxezgrckc9hrfcaj.westus2-01.azurewebsites.net/api/v1';
export let API_BASE_URL: string | null = null;
export let WS_BASE_URL: string | null = null;

// Token management
export let ACCESS_TOKEN: string | null = null;
let API_KEY: string | null = null;

export interface InitResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  authorized_urls: string[];
}

// Update config with initial auth response
export const updateConfig = (initResponse: InitResponse) => {
  API_BASE_URL = initResponse.authorized_urls[0];
  WS_BASE_URL = API_BASE_URL.replace('http', 'ws');
  ACCESS_TOKEN = initResponse.token.access_token;
};

// Store API key for token refresh
export const setApiKey = (apiKey: string) => {
  API_KEY = apiKey;
};

// Get stored API key
export const getApiKey = () => API_KEY;
