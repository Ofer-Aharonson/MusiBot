const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'shuffle',
        description: 'Shuffle the queue of songs'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        guildQueue.shuffle();
        await sendTemporaryReply(interaction, MESSAGES.QUEUE_SHUFFLED);
    }
};
