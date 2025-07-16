import { FastMCP } from "fastmcp";
import { z } from "zod";
import PocketBase from "pocketbase";

// Utility function to get PocketBase client with admin token
function getPocketBaseClient(adminToken?: string, baseUrl?: string) {
  const token = adminToken || process.env.POCKETBASE_ADMIN_TOKEN;
  const url = baseUrl || process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
  
  if (!token) {
    throw new Error("PocketBase admin token is required. Provide it as parameter or set POCKETBASE_ADMIN_TOKEN environment variable.");
  }
  
  const pb = new PocketBase(url);
  pb.authStore.save(token, null);
  return pb;
}

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // PocketBase: Get collections list
  server.addTool({
    name: "list_collections",
    description: "Get the list of all collections from PocketBase",
    parameters: z.object({
      adminToken: z.string().optional().describe("PocketBase admin token (or use POCKETBASE_ADMIN_TOKEN env var)"),
      baseUrl: z.string().optional().describe("PocketBase base URL (or use POCKETBASE_URL env var, default: http://127.0.0.1:8090)")
    }),
    execute: async (params) => {
      try {
        const pb = getPocketBaseClient(params.adminToken, params.baseUrl);
        
        // Get collections list
        const collections = await pb.collections.getFullList();
        
        return JSON.stringify({
          success: true,
          collections: collections.map(col => ({
            id: col.id,
            name: col.name,
            type: col.type,
            schema: col.schema,
            created: col.created,
            updated: col.updated
          }))
        }, null, 2);
      } catch (error) {
        return JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          details: 'Make sure the admin token is valid and PocketBase is running'
        }, null, 2);
      }
    }
  });
}