/**
 * Configuration settings for the WhatsApp Bot
 */

// Load environment variables from .env if available


const config = {
  port: process.env.PORT || 3000,
  whatsapp: {
    verifyToken: process.env.VERIFY_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
    apiVersion: 'v18.0',
    baseUrl: 'https://graph.facebook.com'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Validate critical configuration
if (!config.whatsapp.verifyToken || !config.whatsapp.accessToken) {
  console.error("ERROR: Missing required environment variables VERIFY_TOKEN or ACCESS_TOKEN");
  process.exit(1);
}

module.exports = config;