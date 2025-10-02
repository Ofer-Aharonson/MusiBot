// Message Helper - Auto-delete messages after timeout
const MESSAGE_DELETE_TIMEOUT = process.env.MESSAGE_DELETE_TIMEOUT || 10000;

/**
 * Send a reply that auto-deletes after timeout
 * @param {Interaction} interaction - Discord interaction
 * @param {string} content - Message content
 * @returns {Promise<Message>}
 */
async function sendAutoDeleteReply(interaction, content) {
    try {
        const reply = await interaction.reply({
            content: content,
            fetchReply: true
        });
        
        // Auto-delete after timeout
        setTimeout(() => {
            reply.delete().catch(() => {});
        }, MESSAGE_DELETE_TIMEOUT);
        
        return reply;
    } catch (error) {
        console.error('Error sending auto-delete reply:', error);
        throw error;
    }
}

/**
 * Follow up with a message that auto-deletes
 * @param {Interaction} interaction - Discord interaction
 * @param {string} content - Message content
 * @returns {Promise<Message>}
 */
async function sendAutoDeleteFollowUp(interaction, content) {
    try {
        const reply = await interaction.followUp({
            content: content,
            fetchReply: true
        });
        
        // Auto-delete after timeout
        setTimeout(() => {
            reply.delete().catch(() => {});
        }, MESSAGE_DELETE_TIMEOUT);
        
        return reply;
    } catch (error) {
        console.error('Error sending auto-delete follow-up:', error);
        throw error;
    }
}

module.exports = {
    sendAutoDeleteReply,
    sendAutoDeleteFollowUp,
    MESSAGE_DELETE_TIMEOUT
};
