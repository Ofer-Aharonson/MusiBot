const { RepeatMode } = require('discord-music-player');
const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'stop-loop',
        description: 'Stops the looping of current queue of songs'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
        await sendTemporaryReply(interaction, MESSAGES.LOOP_STOPPED);
    }
};
