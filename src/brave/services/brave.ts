import axios from "axios";
import { config } from "dotenv";

config();

export class BraveService {
  private apiKey: string;
  private baseUrl: string = "https://api.search.brave.com/res/v1/web/search";

  constructor() {
    this.apiKey = process.env.BRAVE_SEARCH_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "BRAVE_API_KEY environment variable not set. Brave search will not work properly."
      );
    }
  }

  /**
   * Search the web using Brave Search API
   * @param query Search query
   * @param count Number of results to return (default: 10)
   * @returns Search results
   */
  async search(query: string, count: number = 10): Promise<any> {
    try {
      if (!this.apiKey) {
        throw new Error("Brave API key not configured");
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          count: count,
        },
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in Brave search:", error);
      throw error;
    }
  }
}
