# Canvora MCP over stdio (bridge to the hosted server at https://api.canvora.ai/mcp).
# Starts without credentials and lists the tools; set CANVORA_API_KEY to make tool calls work.
FROM node:22-alpine
WORKDIR /app/mcp
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci --omit=dev
COPY mcp/ ./
ENTRYPOINT ["node", "server.js"]
