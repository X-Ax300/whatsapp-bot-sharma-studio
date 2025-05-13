/**
 * Session management utility for tracking user conversations
 */

const logger = require('./logger');

// In-memory session store - could be replaced with Redis or MongoDB for production
const sessions = new Map();

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const sessionManager = {
  /**
   * Get or create a session for a user
   * @param {string} phoneNumber - User's phone number
   * @returns {Object} Session object
   */
  getSession(phoneNumber) {
    // If session doesn't exist, create a new one
    if (!sessions.has(phoneNumber)) {
      const newSession = {
        phoneNumber,
        currentMenu: 'main',
        lastActive: Date.now(),
        history: []
      };
      sessions.set(phoneNumber, newSession);
      logger.debug(`Created new session for ${phoneNumber}`);
      return newSession;
    }

    // Return existing session and update last active timestamp
    const session = sessions.get(phoneNumber);
    session.lastActive = Date.now();
    return session;
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

// Setup periodic cleanup of expired sessions (every 15 minutes)
setInterval(() => {
  sessionManager.cleanupSessions();
}, 15 * 60 * 1000);

module.exports = sessionManager;