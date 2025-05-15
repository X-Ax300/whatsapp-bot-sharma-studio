/**
 * Session management utility for tracking user conversations
 */

import logger from './logger.js';

// In-memory session store - could be replaced with Redis or MongoDB for production
const sessions = new Map();

// Session timeout in milliseconds (10 minutes)
const SESSION_TIMEOUT = 10 * 60 * 1000;

const sessionManager = {
  /**
   * Get or create a session for a user
   * @param {string} phoneNumber - User's phone number
   * @returns {Object} Session object
   */
  getSession(phoneNumber) {
    const existingSession = sessions.get(phoneNumber);
    const now = Date.now();

    // Check if session exists and hasn't expired
    if (existingSession && (now - existingSession.lastActive) <= SESSION_TIMEOUT) {
      existingSession.lastActive = now;
      return existingSession;
    }

    // Create new session if none exists or if expired
    const newSession = {
      phoneNumber,
      currentMenu: 'main',
      lastActive: now,
      history: []
    };
    sessions.set(phoneNumber, newSession);
    logger.debug(`Created new session for ${phoneNumber}`);
    return newSession;
  },

  /**
   * Update a user's session data
   * @param {string} phoneNumber - User's phone number
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated session
   */
  updateSession(phoneNumber, updates) {
    const session = this.getSession(phoneNumber);
    const updatedSession = { ...session, ...updates };
    
    // Add interaction to history
    if (updates.userMessage) {
      updatedSession.history.push({
        timestamp: Date.now(),
        userMessage: updates.userMessage,
        botResponse: updates.botResponse || null
      });
    }
    
    sessions.set(phoneNumber, updatedSession);
    logger.debug(`Updated session for ${phoneNumber}`, { currentMenu: updatedSession.currentMenu });
    return updatedSession;
  },

  /**
   * End a user's session
   * @param {string} phoneNumber - User's phone number
   */
  endSession(phoneNumber) {
    if (sessions.has(phoneNumber)) {
      sessions.delete(phoneNumber);
      logger.debug(`Ended session for ${phoneNumber}`);
      return true;
    }
    return false;
  },

  /**
   * Check if a session has expired
   * @param {string} phoneNumber - User's phone number
   * @returns {boolean} - Whether the session has expired
   */
  hasSessionExpired(phoneNumber) {
    const session = sessions.get(phoneNumber);
    if (!session) return true;
    
    const now = Date.now();
    return (now - session.lastActive) > SESSION_TIMEOUT;
  },

  /**
   * Clean up expired sessions
   */
  cleanupSessions() {
    const now = Date.now();
    let expiredCount = 0;
    
    sessions.forEach((session, phoneNumber) => {
      if (now - session.lastActive > SESSION_TIMEOUT) {
        sessions.delete(phoneNumber);
        expiredCount++;
      }
    });
    
    if (expiredCount > 0) {
      logger.info(`Cleaned up ${expiredCount} expired sessions`);
    }
  }
};

// Setup periodic cleanup of expired sessions (every 5 minutes)
setInterval(() => {
  sessionManager.cleanupSessions();
}, 5 * 60 * 1000);

export default sessionManager;