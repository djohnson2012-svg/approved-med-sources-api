// Approved medical source host configurations

export interface MedicalHost {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit?: number;
  trusted: boolean;
  categories: string[];
  authentication?: {
    type: 'api_key' | 'oauth' | 'basic';
    headerName?: string;
  };
}

export const MEDICAL_HOSTS: Record<string, MedicalHost> = {
  pubmed: {
    name: 'PubMed',
    baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
    trusted: true,
    categories: ['research', 'articles', 'clinical_trials'],
    rateLimit: 3, // requests per second
  },
  
  cochrane: {
    name: 'Cochrane Library',
    baseUrl: 'https://api.cochranelibrary.com/',
    trusted: true,
    categories: ['systematic_reviews', 'meta_analysis'],
    authentication: {
      type: 'api_key',
      headerName: 'Authorization'
    }
  },
  
  nejm: {
    name: 'New England Journal of Medicine',
    baseUrl: 'https://www.nejm.org/api/',
    trusted: true,
    categories: ['peer_reviewed', 'clinical_medicine'],
    authentication: {
      type: 'api_key'
    }
  },
  
  who: {
    name: 'World Health Organization',
    baseUrl: 'https://www.who.int/api/',
    trusted: true,
    categories: ['guidelines', 'public_health', 'global_health']
  }
};

export function getHostByName(name: string): MedicalHost | undefined {
  return MEDICAL_HOSTS[name];
}

export function getTrustedHosts(): MedicalHost[] {
  return Object.values(MEDICAL_HOSTS).filter(host => host.trusted);
}

export function getHostsByCategory(category: string): MedicalHost[] {
  return Object.values(MEDICAL_HOSTS).filter(
    host => host.categories.includes(category)
  );
}
