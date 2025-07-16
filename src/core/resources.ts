import { FastMCP } from "fastmcp";
import * as services from "./services/index.js";
import PocketBase from "pocketbase";

/**
 * Register all resources with the MCP server
 * @param server The FastMCP server instance
 */
export function registerResources(server: FastMCP) {
  // Example resource
  server.addResourceTemplate({
    uriTemplate: "example://{id}",
    name: "Example Resource",
    mimeType: "text/plain",
    arguments: [
      {
        name: "id",
        description: "Resource ID",
        required: true,
      },
    ],
    async load({ id }) {
      return {
        text: `This is an example resource with ID: ${id}`
      };
    }
  });
}

export function getPocketBaseClient(adminToken: string, baseUrl: string = "http://127.0.0.1:8090") {
  const pb = new PocketBase(baseUrl);
  pb.authStore.save(adminToken, null);
  return pb;
}

// Exemple de schéma de paramètres MCP
export interface MCPConfig {
  pocketbaseAdminToken: string;
  pocketbaseUrl?: string; // optionnel, par défaut http://127.0.0.1:8090
} 