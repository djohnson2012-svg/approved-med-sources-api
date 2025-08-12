// Authentication utilities for medical sources API

import { MedicalHost } from './hosts';

export interface AuthConfig {
  apiKey?: string;
  token?: string;
  username?: string;
  password?: string;
}

export interface RequestHeaders {
  [key: string]: string;
}

export function buildAuthHeaders(
  host: MedicalHost, 
  config: AuthConfig
): RequestHeaders {
  const headers: RequestHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'approved-med-sources-api/1.0.0'
  };

  if (!host.authentication) {
    return headers;
  }

  switch (host.authentication.type) {
    case 'api_key':
      if (config.apiKey) {
        const headerName = host.authentication.headerName || 'X-API-Key';
        headers[headerName] = config.apiKey;
      }
      break;
      
    case 'oauth':
      if (config.token) {
        headers['Authorization'] = `Bearer ${config.token}`;
      }
      break;
      
    case 'basic':
      if (config.username && config.password) {
        const credentials = Buffer.from(
          `${config.username}:${config.password}`
        ).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      }
      break;
  }

  return headers;
}

export function validateAuthConfig(
  host: MedicalHost, 
  config: AuthConfig
): boolean {
  if (!host.authentication) {
    return true; // No authentication required
  }

  switch (host.authentication.type) {
    case 'api_key':
      return !!config.apiKey;
    case 'oauth':
      return !!config.token;
    case 'basic':
      return !!(config.username && config.password);
    default:
      return false;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, public host: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
