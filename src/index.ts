// Import Express framework for building the web server
import express from 'express';

// Initialize Express application instance
const app = express();
// Set port from environment variable or default to 3001
const port = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Global error handling middleware - catches all errors and returns appropriate response
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ 
    error: 'Internal Server Error',
    // Show detailed error message only in development environment for security
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Root endpoint - simple welcome message
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Health check endpoint - provides server status and uptime information
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Catch-all 404 handler - must be defined last to catch unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Route ${req.method} ${req.originalUrl} not found` 
  });
});

// Graceful shutdown handling - ensures proper cleanup when server receives termination signals
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] SIGTERM received, shutting down gracefully`);
  process.exit(0);
});

// Handle Ctrl+C (SIGINT) for graceful shutdown during development
process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] SIGINT received, shutting down gracefully`);
  process.exit(0);
});

// Start the server and listen on the specified port
const server = app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Backend server started successfully`);
  console.log(`[${new Date().toISOString()}] Server listening at http://localhost:${port}`);
  console.log(`[${new Date().toISOString()}] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${new Date().toISOString()}] Process ID: ${process.pid}`);
});

// Handle server errors - log detailed error information for debugging
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] Server error: ${err.message}`);
  console.error(`[${new Date().toISOString()}] Stack: ${err.stack}`);
}); 