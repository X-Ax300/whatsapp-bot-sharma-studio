/**
 * Main application entry point
 */

import express from 'express';
import config from './config/index.js';
import logger from './utils/logger.js';
import webhookRoutes from './routes/webhook.js';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Mount routes
app.use('/webhook', webhookRoutes);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Graceful shutdown
function gracefulShutdown() {
  logger.info('Received shutdown signal. Closing server...');
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
}

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  gracefulShutdown();
});

export default app;