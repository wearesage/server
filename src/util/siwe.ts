export function extractToolsFromSiweMessage(message: string): Array<{name: string, description: string}> {
  const tools = [];
  
  // Method 1: Extract from Resources section (the clean URN format)
  const resourcesMatch = message.match(/Resources:\n([\s\S]*?)(?:\n\nTools to authorize:|$)/);
  if (resourcesMatch) {
    const resources = resourcesMatch[1].trim().split('\n');
    
    for (const resource of resources) {
      // Parse URN format: urn:goat:tool:toolName:description
      const match = resource.match(/^-\s*urn:goat:tool:([^:]+):(.+)$/);
      if (match) {
        tools.push({
          name: match[1],
          description: decodeURIComponent(match[2])
        });
      }
    }
  } else {
  
    // Method 2: Extract from "Tools to authorize" section (the readable format)
    const toolsMatch = message.match(/Tools to authorize:\n([\s\S]*)$/);
    if (toolsMatch && tools.length === 0) {
      const lines = toolsMatch[1].trim().split('\n');
      
      for (const line of lines) {
        const match = line.match(/^-\s*([^:]+):\s*(.+)$/);
        if (match) {
          tools.push({
            name: match[1].trim(),
            description: match[2].trim()
          });
        }
      }
    }
  }
  
  return tools;
}