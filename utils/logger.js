/**
 * Logger utility for consistent logging
 */

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = process.env.LOG_LEVEL || 'info';

function shouldLog(level) {
  return logLevels[level] <= logLevels[currentLevel];
}

const logger = {
  error: (message, data) => {
    if (shouldLog('error')) {
      console.error(`🔥 ERROR: ${message}`, data || '');
    }
  },
  
  warn: (message, data) => {
    if (shouldLog('warn')) {
      console.warn(`⚠️ WARN: ${message}`, data || '');
    }
  },
  
  info: (message, data) => {
    if (shouldLog('info')) {
      console.log(`ℹ️ INFO: ${message}`, data || '');
    }
  },
  
  debug: (message, data) => {
    if (shouldLog('debug')) {
      console.log(`🔍 DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
};

module.exports = logger;