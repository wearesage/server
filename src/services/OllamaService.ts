import axios, { AxiosInstance } from 'axios';

interface OllamaCompletionRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
    repeat_penalty?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    tfs_z?: number;
    mirostat?: number;
    mirostat_tau?: number;
    mirostat_eta?: number;
    seed?: number;
  };
}

interface OllamaCompletionResponse {
  model: string;
  created_at: string;
  response: string;
  context?: number[];
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaEmbeddingRequest {
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
  };
}

interface OllamaEmbeddingResponse {
  embedding: number[];
}

interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export class OllamaService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * List all available models
   */
  async listModels(): Promise<{ models: OllamaModelInfo[] }> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data;
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  /**
   * Generate a completion for the given prompt
   */
  async generateCompletion(request: OllamaCompletionRequest): Promise<OllamaCompletionResponse> {
    try {
      const response = await this.client.post('/api/generate', request);
      return response.data;
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for the given text
   */
  async generateEmbedding(request: OllamaEmbeddingRequest): Promise<OllamaEmbeddingResponse> {
    try {
      const response = await this.client.post('/api/embeddings', request);
      return response.data;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Check if the Ollama server is running
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch (error) {
      console.error('Ollama server is not running:', error);
      return false;
    }
  }
}

export default OllamaService;