/**
 * MCP (Model Context Protocol) Server Example
 * 
 * This is an example of how to expose tools via MCP protocol.
 * MCP is the emerging standard for AI agent tool calling.
 * 
 * Reference: https://modelcontextprotocol.io
 * 
 * This example provides:
 * - /tools/list: List available tools
 * - /tools/call: Execute a tool
 * - /resources/list: List available resources
 */

const express = require('express');
const router = express.Router();

// Tool definitions
const tools = [
  {
    name: 'get_server_status',
    description: 'Get current server status and health metrics',
    inputSchema: {
      type: 'object',
      properties: {
        includeMetrics: { type: 'boolean', description: 'Include detailed metrics' }
      }
    }
  },
  {
    name: 'search_users',
    description: 'Search users by name or email',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results', default: 10 }
      }
    }
  },
  {
    name: 'create_notification',
    description: 'Create a notification for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        message: { type: 'string', description: 'Notification message' },
        type: { type: 'string', enum: ['info', 'warning', 'error'], default: 'info' }
      },
      required: ['userId', 'message']
    }
  }
];

// Resources
const resources = [
  {
    uri: 'server://config',
    name: 'Server Configuration',
    description: 'Current server configuration',
    mimeType: 'application/json'
  },
  {
    uri: 'server://metrics',
    name: 'Server Metrics',
    description: 'Current server metrics',
    mimeType: 'application/json'
  }
];

// Tool implementations
const toolHandlers = {
  get_server_status: async (params) => {
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
    
    return {
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      ...(params.includeMetrics ? { metrics } : {})
    };
  },
  
  search_users: async (params) => {
    // Example implementation - replace with actual DB query
    const { query, limit = 10 } = params;
    return {
      results: [],
      query,
      total: 0,
      message: 'Connect to your database to implement search'
    };
  },
  
  create_notification: async (params) => {
    const { userId, message, type = 'info' } = params;
    // Example implementation - replace with actual notification logic
    return {
      success: true,
      notification: { userId, message, type, createdAt: new Date().toISOString() }
    };
  }
};

// MCP endpoints
router.get('/tools/list', (req, res) => {
  res.json({ tools });
});

router.post('/tools/call', async (req, res) => {
  const { name, arguments: args } = req.body;
  
  if (!name || !toolHandlers[name]) {
    return res.status(400).json({
      error: {
        code: 'INVALID_TOOL',
        message: `Unknown tool: ${name}`
      }
    });
  }
  
  try {
    const result = await toolHandlers[name](args);
    res.json({ content: [{ type: 'text', text: JSON.stringify(result) }] });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'TOOL_ERROR',
        message: error.message
      }
    });
  }
});

router.get('/resources/list', (req, res) => {
  res.json({ resources });
});

router.get('/resources/:uri', (req, res) => {
  const { uri } = req.params;
  
  if (uri === 'config') {
    return res.json({
      uri: 'server://config',
      content: Buffer.from(JSON.stringify({
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV
      })).toString('base64')
    });
  }
  
  if (uri === 'metrics') {
    return res.json({
      uri: 'server://metrics',
      content: Buffer.from(JSON.stringify({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      })).toString('base64')
    });
  }
  
  res.status(404).json({ error: 'Resource not found' });
});

// Health check for MCP server
router.get('/health', (req, res) => {
  res.json({ status: 'ok', protocol: 'mcp', version: '1.0.0' });
});

module.exports = router;
