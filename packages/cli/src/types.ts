export interface PackageInfo {
  name: string;
  title: string;
  description: string;
  platformType: 'communication' | 'tool' | 'agent' | 'internal';
  path: string;
  dependencies: string[];
  status: 'stable' | 'external' | 'semiStable' | 'unstable' | 'oauthConnector' | 'webhookConnector' | 'internal';
  documentation: string;
  icon: string;
  constructors: any[];
  extraInfo: string[];
  authType: 'oauth2' | 'apikey' | 'none';
} 