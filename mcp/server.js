#!/usr/bin/env node
/**
 * Canvora MCP over stdio: a thin bridge to the hosted server at https://api.canvora.ai/mcp.
 *
 * For MCP clients that only speak stdio, and for directories that inspect servers by starting
 * them in a container. Every tool call is forwarded to the hosted server with your API key;
 * nothing is generated locally.
 *
 *   CANVORA_API_KEY=vd_...  node mcp/server.js
 *
 * Without a key it still starts and lists the tools (from tools.json), and each tool call
 * explains how to get a key.
 */
import { readFileSync } from 'node:fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_URL = (process.env.CANVORA_API_URL || 'https://api.canvora.ai').replace(/\/+$/, '');
const API_KEY = process.env.CANVORA_API_KEY || '';
const CATALOG = JSON.parse(readFileSync(new URL('./tools.json', import.meta.url), 'utf8'));
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const NO_KEY = 'CANVORA_API_KEY is not set. Create a key at https://canvora.ai/api-access '
  + '(all plans, including Free) and set it in this MCP server\'s environment.';

// One connection to the hosted server, opened on first use and reopened if it drops.
let remote = null;
async function hosted() {
  if (remote) return remote;
  const client = new Client({ name: 'canvora-mcp-stdio', version });
  const transport = new StreamableHTTPClientTransport(new URL(`${API_URL}/mcp`), {
    requestInit: { headers: { Authorization: `Bearer ${API_KEY}` } },
  });
  client.onclose = () => { remote = null; };
  await client.connect(transport);
  remote = client;
  return client;
}

const server = new Server({ name: 'canvora', version }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!API_KEY) return { tools: CATALOG };
  try {
    return await (await hosted()).listTools();
  } catch (e) {
    console.error(`[canvora-mcp] could not list tools from ${API_URL}/mcp, using the bundled list: ${e.message}`);
    return { tools: CATALOG };
  }
});

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (!API_KEY) return { content: [{ type: 'text', text: NO_KEY }], isError: true };
  try {
    return await (await hosted()).callTool(req.params);
  } catch (e) {
    remote = null;
    const auth = /401|unauthori[sz]ed|invalid.*key/i.test(e.message);
    const text = auth
      ? 'Canvora rejected the API key. Check CANVORA_API_KEY or create a new key at https://canvora.ai/api-access.'
      : `Canvora could not complete the request: ${e.message}`;
    return { content: [{ type: 'text', text }], isError: true };
  }
});

await server.connect(new StdioServerTransport());
// The client closing stdin means "stop"; the open connection to the hosted server would otherwise
// keep the process alive.
const shutdown = async () => { try { await remote?.close(); } catch {} process.exit(0); };
process.stdin.on('end', shutdown);
process.stdin.on('close', shutdown);
console.error(`[canvora-mcp] ready (${API_KEY ? `bridging to ${API_URL}/mcp` : 'no API key: listing tools only'})`);
