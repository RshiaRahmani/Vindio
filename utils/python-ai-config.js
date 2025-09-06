// Python AI Server Configuration
export const PYTHON_AI_CONFIG = {
  // Default localhost configuration
  host: '127.0.0.1',
  port: '3000',
  
  // Alternative configurations you can uncomment/modify:
  // host: '192.168.1.100', // Your local network IP
  // port: '5000',          // Alternative port
  
  // API endpoints
  endpoints: {
    chat: '/ask',
    reset: '/reset',
    health: '/health'
  },
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 2,
  
  // Get full endpoint URLs
  getUrl(endpoint) {
    return `http://${this.host}:${this.port}${this.endpoints[endpoint] || endpoint}`
  },
  
  // Health check function
  async checkHealth() {
    try {
      const response = await fetch(this.getUrl('health'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      })
      return response.ok
    } catch (error) {
      console.warn('Python server health check failed:', error)
      return false
    }
  }
}

// Export individual values for convenience
export const PYTHON_SERVER_HOST = PYTHON_AI_CONFIG.host
export const PYTHON_SERVER_PORT = PYTHON_AI_CONFIG.port
