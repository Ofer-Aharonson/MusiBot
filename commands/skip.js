const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'skip',
        description: 'Skip the current song'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        await sendTemporaryReply(interaction, MESSAGES.SKIPPING(guildQueue.nowPlaying));
        guildQueue.skip();
    }
};
