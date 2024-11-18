import { Store } from '@/lib/models/store.model';

function sanitizeSubdomain(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
    .substring(0, 63);           // Limit length
}

export async function generateUniqueSubdomain(name: string): Promise<string> {
  if (!name) {
    throw new Error('Name is required to generate subdomain');
  }

  let subdomain = sanitizeSubdomain(name);
  
  if (!subdomain) {
    throw new Error('Invalid name for subdomain generation');
  }

  let counter = 1;
  let uniqueSubdomain = subdomain;
  
  // Keep trying until we find a unique subdomain
  while (true) {
    const exists = await Store.findOne({ 
      'domainSettings.subdomain': uniqueSubdomain 
    });
    
    if (!exists) {
      return uniqueSubdomain;
    }

    uniqueSubdomain = `${subdomain}${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error('Unable to generate unique subdomain');
    }
  }
}

export function validateDomain(domain: string): boolean {
  if (!domain) return false;

  // Basic domain validation regex
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
  return domainRegex.test(domain);
}