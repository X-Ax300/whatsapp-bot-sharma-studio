/**
 * Service for interacting with the WhatsApp API
 */

const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * WhatsApp API service
 */
class WhatsappService {
  constructor() {
    this.baseUrl = config.whatsapp.baseUrl;
    this.apiVersion = config.whatsapp.apiVersion;
    this.accessToken = config.whatsapp.accessToken;
  }

  /**
   * Send a text message to a WhatsApp user
   * @param {string} phoneNumberId - The phone number ID to send from
   * @param {string} to - Recipient's phone number
   * @param {string} message - Message text to send
   * @returns {Promise} - API response
   */
  async sendTextMessage(phoneNumberId, to, message) {
    try {
      const url = `${this.baseUrl}/${this.apiVersion}/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
      };
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      logger.debug('Message sent successfully', { to, messageId: response.data?.messages?.[0]?.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to send WhatsApp message', {
        to,
        error: error.response?.data || error.message
      });
      throw error;
    }
  }
  
  /**
   * Verify webhook subscription
   * @param {string} token - Token to verify
   * @param {string} challenge - Challenge string to return
   * @returns {boolean} - Whether verification was successful
   */
  verifyWebhook(token, challenge) {
    if (token === config.whatsapp.verifyToken) {
      logger.info('Webhook verified successfully');
      return { success: true, challenge };
    }
    
    logger.warn('Webhook verification failed - invalid token');
    return { success: false };
  }
}

module.exports = new WhatsappService();