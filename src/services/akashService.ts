import axios, { AxiosInstance } from 'axios';
import {
  Provider,
  NetworkCapacity,
  DeploymentList,
  TemplateCategory,
  GpuPrices,
  Deployment,
  Template
} from '../interfaces/akash.interfaces';

/**
 * Service for interacting with the Akash Network API
 */
export class AkashService {
  private readonly apiClient: AxiosInstance;
  private readonly baseUrl: string;

  /**
   * Creates a new instance of AkashService
   * @param baseUrl The base URL for the Akash API
   */
  constructor(baseUrl: string = 'https://console-api.akash.network/v1') {
    this.baseUrl = baseUrl;
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Get a list of providers
   * @returns A list of providers
   */
  async getProviders(): Promise<Provider[]> {
    try {
      const response = await this.apiClient.get<Provider[]>('/providers');
      return response.data;
    } catch (error) {
      this.handleError('Error fetching providers', error);
      return [];
    }
  }

  /**
   * Get a provider by address
   * @param address The provider's address
   * @returns The provider details
   */
  async getProvider(address: string): Promise<Provider | null> {
    try {
      const response = await this.apiClient.get<Provider>(`/providers/${address}`);
      return response.data;
    } catch (error) {
      this.handleError(`Error fetching provider with address ${address}`, error);
      return null;
    }
  }

  /**
   * Get network capacity statistics
   * @returns Network capacity statistics
   */
  async getNetworkCapacity(): Promise<NetworkCapacity | null> {
    try {
      const response = await this.apiClient.get<NetworkCapacity>('/network-capacity');
      return response.data;
    } catch (error) {
      this.handleError('Error fetching network capacity', error);
      return null;
    }
  }

  /**
   * Get deployments for a provider
   * @param provider The provider's address
   * @param skip Number of deployments to skip
   * @param limit Number of deployments to return
   * @param status Filter by status (optional)
   * @returns A list of deployments
   */
  async getProviderDeployments(
    provider: string,
    skip: number = 0,
    limit: number = 20,
    status?: 'active' | 'closed'
  ): Promise<Deployment[]> {
    try {
      const url = `/providers/${provider}/deployments/${skip}/${limit}`;
      const params = status ? { status } : {};
      const response = await this.apiClient.get<Deployment[]>(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(`Error fetching deployments for provider ${provider}`, error);
      return [];
    }
  }

  /**
   * Get deployments for an address
   * @param address The owner's address
   * @param skip Number of deployments to skip
   * @param limit Number of deployments to return
   * @param status Filter by status (optional)
   * @param reverseSorting Reverse sorting (optional)
   * @returns A list of deployments
   */
  async getAddressDeployments(
    address: string,
    skip: number = 0,
    limit: number = 20,
    status?: string,
    reverseSorting?: boolean
  ): Promise<DeploymentList | null> {
    try {
      const url = `/addresses/${address}/deployments/${skip}/${limit}`;
      const params: Record<string, string | boolean> = {};
      
      if (status) params.status = status;
      if (reverseSorting !== undefined) params.reverseSorting = reverseSorting;
      
      const response = await this.apiClient.get<DeploymentList>(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(`Error fetching deployments for address ${address}`, error);
      return null;
    }
  }

  /**
   * Get deployment templates
   * @returns A list of deployment templates grouped by categories
   */
  async getTemplates(): Promise<TemplateCategory[]> {
    try {
      const response = await this.apiClient.get<TemplateCategory[]>('/templates');
      return response.data;
    } catch (error) {
      this.handleError('Error fetching templates', error);
      return [];
    }
  }

  /**
   * Get a template by ID
   * @param id The template ID
   * @returns The template details
   */
  async getTemplate(id: string): Promise<Template | null> {
    try {
      const response = await this.apiClient.get<{ data: Template }>(`/templates/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(`Error fetching template with ID ${id}`, error);
      return null;
    }
  }

  /**
   * Get GPU prices and availability
   * @returns GPU prices and availability
   */
  async getGpuPrices(): Promise<GpuPrices | null> {
    try {
      const response = await this.apiClient.get<GpuPrices>('/gpu-prices');
      return response.data;
    } catch (error) {
      this.handleError('Error fetching GPU prices', error);
      return null;
    }
  }

  /**
   * Estimate deployment price
   * @param cpu CPU in thousandths of a core (1000 = 1 core)
   * @param memory Memory in bytes
   * @param storage Storage in bytes
   * @returns Price estimation for different cloud providers
   */
  async estimatePrice(
    cpu: number,
    memory: number,
    storage: number
  ): Promise<{ akash: number; aws: number; gcp: number; azure: number } | null> {
    try {
      const response = await this.apiClient.post('/pricing', {
        cpu,
        memory,
        storage
      });
      
      return {
        akash: response.data.akash,
        aws: response.data.aws,
        gcp: response.data.gcp,
        azure: response.data.azure
      };
    } catch (error) {
      this.handleError('Error estimating price', error);
      return null;
    }
  }

  /**
   * Handle API errors
   * @param message Error message
   * @param error The error object
   */
  private handleError(message: string, error: any): void {
    console.error(`${message}: ${error.message}`);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    }
    
    throw new Error(message);
  }
}

// Export a singleton instance with the default base URL
export const akashService = new AkashService();