/**
 * Simple logger utility
 * TODO: Replace with Winston or Pino for production
 */
const logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    },
    
    error: (message, error) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    
    warn: (message, ...args) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    },
    
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
};

module.exports = logger;
