import { Tool } from "@goat-sdk/core";
import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";
import { BraveService } from "./services/brave";

export class WebSearchParameters extends createToolParameters(
  z.object({
    query: z.string(),
    count: z.number().optional().default(5)
  })
) {}

const service = new BraveService()

export class BraveTools {
  @Tool({
    name: "search_web",
    description: "Search the web for anything.",
  })
  async searchWeb (
    { query, count }: WebSearchParameters
  ) {
    const results = await service.search(query, count)
    return results
  }
}
