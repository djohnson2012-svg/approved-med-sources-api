// HTTP fetchers for medical sources

import { MedicalHost, getHostByName } from './hosts';
import { AuthConfig, buildAuthHeaders, validateAuthConfig, AuthenticationError } from './auth';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

export interface MedicalFetchResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
  url: string;
}

export class MedicalFetcher {
  private host: MedicalHost;
  private authConfig: AuthConfig;

  constructor(hostName: string, authConfig: AuthConfig = {}) {
    const host = getHostByName(hostName);
    if (!host) {
      throw new Error(`Unknown host: ${hostName}`);
    }
    
    this.host = host;
    this.authConfig = authConfig;

    // Validate authentication configuration
    if (!validateAuthConfig(host, authConfig)) {
      throw new AuthenticationError(
        `Invalid authentication configuration for ${host.name}`,
        hostName
      );
    }
  }

  async fetch(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<MedicalFetchResponse> {
    const url = `${this.host.baseUrl}${endpoint}`;
    const authHeaders = buildAuthHeaders(this.host, this.authConfig);
    
    const fetchOptions = {
      method: options.method || 'GET',
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      body: options.body,
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        data,
        status: response.status,
        headers: responseHeaders,
        url: response.url,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch from ${this.host.name}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async get(endpoint: string, headers?: Record<string, string>) {
    return this.fetch(endpoint, { method: 'GET', headers });
  }

  async post(
    endpoint: string,
    body: string,
    headers?: Record<string, string>
  ) {
    return this.fetch(endpoint, { method: 'POST', body, headers });
  }
}
