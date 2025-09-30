const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.info(`🎶 ${client.user.tag} is online and kicking! 🎶`);
        logger.info(`Serving ${client.guilds.cache.size} guilds`);
    }
};
