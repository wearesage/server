/**
 * Interfaces for Akash Network API responses
 */

// Provider interfaces
export interface Provider {
  owner: string;
  name: string;
  hostUri: string;
  createdHeight: number;
  email: string | null;
  website: string | null;
  lastCheckDate: string | null;
  deploymentCount: number;
  leaseCount: number;
  cosmosSdkVersion: string;
  akashVersion: string;
  ipRegion: string | null;
  ipRegionCode: string | null;
  ipCountry: string | null;
  ipCountryCode: string | null;
  ipLat: string | null;
  ipLon: string | null;
  uptime1d: number;
  uptime7d: number;
  uptime30d: number;
  isValidVersion: boolean;
  isOnline: boolean;
  lastOnlineDate: string | null;
  isAudited: boolean;
  activeStats: ResourceStats;
  pendingStats: ResourceStats;
  availableStats: ResourceStats;
  gpuModels: GpuModel[];
  attributes: ProviderAttribute[];
}

export interface ResourceStats {
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
}

export interface GpuModel {
  vendor: string;
  model: string;
  ram: string;
  interface: string;
}

export interface ProviderAttribute {
  key: string;
  value: string;
  auditedBy: string[];
}

// Deployment interfaces
export interface Deployment {
  owner: string;
  dseq: string;
  status: string;
  createdHeight: number;
  cpuUnits: number;
  gpuUnits: number;
  memoryQuantity: number;
  storageQuantity: number;
}

export interface DeploymentList {
  count: number;
  results: Deployment[];
}

// Network capacity interfaces
export interface NetworkCapacity {
  activeProviderCount: number;
  activeCPU: number;
  activeGPU: number;
  activeMemory: number;
  activeStorage: number;
  pendingCPU: number;
  pendingGPU: number;
  pendingMemory: number;
  pendingStorage: number;
  availableCPU: number;
  availableGPU: number;
  availableMemory: number;
  availableStorage: number;
  totalCPU: number;
  totalGPU: number;
  totalMemory: number;
  totalStorage: number;
  activeEphemeralStorage: number;
  pendingEphemeralStorage: number;
  availableEphemeralStorage: number;
  activePersistentStorage: number;
  pendingPersistentStorage: number;
  availablePersistentStorage: number;
}

// Template interfaces
export interface Template {
  id: string;
  name: string;
  path: string;
  logoUrl: string | null;
  summary: string;
  readme: string | null;
  deploy: string;
  persistentStorageEnabled: boolean;
  guide: string | null;
  githubUrl: string;
  config: {
    ssh: boolean;
  };
}

export interface TemplateCategory {
  title: string;
  templates: Template[];
}

// GPU interfaces
export interface GpuAvailability {
  total: number;
  available: number;
}

export interface GpuPricing {
  currency: string;
  min: number;
  max: number;
  avg: number;
  weightedAverage: number;
  med: number;
}

export interface GpuModelWithPricing {
  vendor: string;
  model: string;
  ram: string;
  interface: string;
  availability: GpuAvailability;
  providerAvailability: GpuAvailability;
  price: GpuPricing;
}

export interface GpuPrices {
  availability: GpuAvailability;
  models: GpuModelWithPricing[];
}