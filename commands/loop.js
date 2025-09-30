const { RepeatMode } = require('discord-music-player');
const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'loop',
        description: 'Loops current song'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        guildQueue.setRepeatMode(RepeatMode.SONG);
        await sendTemporaryReply(interaction, MESSAGES.LOOP_SONG);
    }
};
