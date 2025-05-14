/**
 * Routes for handling WhatsApp webhook requests
 */

const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const messageController = require('../controllers/messageController');
const logger = require('../utils/logger');

/**
 * GET /webhook - Handle webhook verification
 */
router.get('/', (req, res) => {
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  logger.debug('Webhook verification attempt', { token });
  
  const verification = whatsappService.verifyWebhook(token, challenge);
  
  if (verification.success) {
    return res.status(200).send(verification.challenge);
  }
  
  return res.sendStatus(403);
});

/**
 * POST /webhook - Process incoming webhook messages
 */
router.post('/', async (req, res) => {
  try {
    logger.debug('Received webhook data', req.body);
    
    // Process the message asynchronously
    const result = await messageController.handleIncomingMessage(req.body);
    
    // Always return 200 OK to WhatsApp to acknowledge receipt
    res.sendStatus(200);
    
    logger.debug('Webhook processing result', result);
  } catch (error) {
    logger.error('Error in webhook processing', error);
    
    // Still return 200 OK to WhatsApp to prevent retries
    res.sendStatus(200);
  }
});

module.exports = router;