const { MESSAGE_DELETE_TIMEOUT, ERRORS } = require('../config/constants');

/**
 * Gets the queue for a guild or sends an error message if none exists
 * @param {Object} interaction - Discord interaction object
 * @param {Object} client - Discord client with player attached
 * @returns {Promise<Object|null>} Queue object or null if none exists
 */
async function getQueueOrReply(interaction, client) {
    const guildQueue = client.player.getQueue(interaction.guild);
    
    if (!guildQueue) {
        await interaction.editReply({ content: ERRORS.NO_SONG_PLAYING });
        setTimeout(() => interaction.deleteReply().catch(() => {}), MESSAGE_DELETE_TIMEOUT);
        return null;
    }
    
    return guildQueue;
}

/**
 * Sends a temporary reply that auto-deletes
 * @param {Object} interaction - Discord interaction object
 * @param {string} content - Message content
 */
async function sendTemporaryReply(interaction, content) {
    await interaction.editReply({ content });
    setTimeout(() => interaction.deleteReply().catch(() => {}), MESSAGE_DELETE_TIMEOUT);
}

module.exports = {
    getQueueOrReply,
    sendTemporaryReply
};
