const { RepeatMode } = require('discord-music-player');
const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'queue-loop',
        description: 'Loops the entire queue of songs'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        guildQueue.setRepeatMode(RepeatMode.QUEUE);
        await sendTemporaryReply(interaction, MESSAGES.LOOP_QUEUE);
    }
};
