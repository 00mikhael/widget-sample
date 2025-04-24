// Default URLs used only until initialization
export const DEFAULT_API_URL = 'http://localhost:8002';

export let API_BASE_URL = DEFAULT_API_URL;
export let WS_BASE_URL = DEFAULT_API_URL.replace('http', 'ws');
export let ACCESS_TOKEN: string | null = null;

export interface InitResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  authorized_urls: string[];
}

export const updateConfig = (initResponse: InitResponse) => {
  API_BASE_URL = initResponse.authorized_urls[0]; // Use first authorized URL
  WS_BASE_URL = API_BASE_URL.replace('http', 'ws');
  ACCESS_TOKEN = initResponse.token.access_token;
};
