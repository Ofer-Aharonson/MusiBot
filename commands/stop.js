const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'stop',
        description: 'Stop the player completely'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        guildQueue.stop();
        await sendTemporaryReply(interaction, MESSAGES.STOPPED);
    }
};
