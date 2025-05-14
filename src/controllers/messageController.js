/**
 * Controller for handling incoming WhatsApp messages
 */

import whatsappService from '../services/whatsappService.js';
import sessionManager from '../utils/sessionManager.js';
import responses from '../data/responses.js';
import logger from '../utils/logger.js';

/**
 * Check if a message is a greeting
 * @param {string} message - Message to check
 * @returns {boolean} - Whether the message is a greeting
 */
function isGreeting(message) {
  const greetings = ['hola', 'buenos dias', 'buen dia', 'buenas tardes', 'buenas noches', 'hi', 'hello'];
  return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

/**
 * Process menu selection and return appropriate response
 * @param {string} selection - User's menu selection
 * @param {Object} session - User's session data
 * @returns {Object} - Response and next menu state
 */
function processMenuSelection(selection, session) {
  const currentMenu = session.currentMenu;
  let response = '';
  let nextMenu = currentMenu;

  // Check for greeting first
  if (isGreeting(selection)) {
    response = responses.welcome;
    nextMenu = 'main';
    return { response, nextMenu };
  }

  // Process main menu selections
  if (currentMenu === 'main') {
    switch (selection) {
      case '1':
        response = responses.designGraphic;
        nextMenu = 'designGraphic';
        break;
      case '2':
        response = responses.socialMedia;
        nextMenu = 'socialMedia';
        break;
      case '3':
        response = responses.webDevelopment;
        nextMenu = 'webDevelopment';
        break;
      case '4':
        response = responses.printing;
        nextMenu = 'printing';
        break;
      case '5':
        response = responses.agent;
        nextMenu = 'agent';
        break;
      case '6':
        response = responses.priceList;
        nextMenu = 'priceList';
        break;
      case '7':
        response = responses.quote;
        nextMenu = 'quote';
        break;
      case '8':
        response = responses.routine;
        nextMenu = 'routine_type';
        break;
      case '9':
        response = responses.hairTreatments;
        nextMenu = 'hairTreatments';
        break;
      case '10':
        response = responses.hairProducts;
        nextMenu = 'hairProducts';
        break;
      case '0':
        response = responses.closingSession;
        nextMenu = 'closed';
        break;
      default:
        response = responses.default;
        break;
    }
  }
  // Process routine flow
  else if (currentMenu === 'routine_type') {
    if (['1', '2', '3', '4'].includes(selection)) {
      response = responses.routineConcern;
      nextMenu = 'routine_concern';
      session.hairType = selection;
    } else {
      response = responses.default;
    }
  }
  else if (currentMenu === 'routine_concern') {
    if (['1', '2', '3', '4', '5'].includes(selection)) {
      response = responses.routineRecommendation;
      nextMenu = 'routine_recommendation';
      session.concern = selection;
      
      // Schedule reminder for 48 hours later
      setTimeout(() => {
        const userSession = sessionManager.getSession(session.phoneNumber);
        if (userSession && !userSession.purchased) {
          whatsappService.sendTextMessage(
            session.phoneNumberId,
            session.phoneNumber,
            responses.reminder
          );
        }
      }, 48 * 60 * 60 * 1000);
    } else {
      response = responses.default;
    }
  }
  // Process hair treatments menu
  else if (currentMenu === 'hairTreatments') {
    if (['1', '2', '3'].includes(selection)) {
      response = `Gracias por tu interés en nuestros tratamientos. Un especialista en cuidado capilar se pondrá en contacto contigo para brindarte información detallada.\n\n0. Volver al menú principal`;
      nextMenu = currentMenu;
    } else {
      response = responses.default;
    }
  }
  // Process hair products menu
  else if (currentMenu === 'hairProducts') {
    if (['1', '2', '3'].includes(selection)) {
      response = `Gracias por tu interés en nuestros productos. Un asesor de belleza se pondrá en contacto contigo para recomendarte los productos ideales para tu tipo de cabello.\n\n0. Volver al menú principal`;
      nextMenu = currentMenu;
    } else {
      response = responses.default;
    }
  }
  // Return to main menu for '0'
  else if (selection === '0') {
    response = responses.welcome;
    nextMenu = 'main';
  }
  // Handle other submenus
  else if (['designGraphic', 'socialMedia', 'webDevelopment', 'printing', 'agent', 'priceList', 'quote'].includes(currentMenu)) {
    response = `Gracias por tu selección. Un asesor se pondrá en contacto contigo pronto para brindarte información detallada.\n\n0. Volver al menú principal`;
    nextMenu = currentMenu;
  }
  else {
    response = responses.default;
  }

  return { response, nextMenu };
}

/**
 * Handle an incoming WhatsApp message
 * @param {Object} messageData - Message data from webhook
 * @returns {Promise} - Processing result
 */
async function handleIncomingMessage(messageData) {
  try {
    const entry = messageData.entry?.[0];
    if (!entry) {
      logger.debug('No entry in webhook data');
      return { success: false, error: 'No entry in webhook data' };
    }

    const changes = entry.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    
    // Skip if not a text message
    if (!message || message.type !== 'text') {
      logger.debug('Not a text message or no message found');
      return { success: true, info: 'Not a text message' };
    }

    const phoneNumberId = value.metadata.phone_number_id;
    const userPhoneNumber = message.from;
    const messageText = message.text.body.trim();
    
    // Get or create user session
    const session = sessionManager.getSession(userPhoneNumber);
    session.phoneNumberId = phoneNumberId;
    session.phoneNumber = userPhoneNumber;
    
    // Process the message based on session state
    const { response, nextMenu } = processMenuSelection(messageText, session);
    
    // Update session with new state
    sessionManager.updateSession(userPhoneNumber, {
      currentMenu: nextMenu,
      userMessage: messageText,
      botResponse: response
    });
    
    // End session if closing
    if (nextMenu === 'closed') {
      sessionManager.endSession(userPhoneNumber);
    }
    
    // Send response back to user
    await whatsappService.sendTextMessage(phoneNumberId, userPhoneNumber, response);
    
    logger.info(`Processed message from ${userPhoneNumber}`, { 
      menu: nextMenu,
      messageId: message.id
    });
    
    return { success: true };
  } catch (error) {
    logger.error('Error handling incoming message', error);
    return { success: false, error: error.message };
  }
}

export default {
  handleIncomingMessage
};