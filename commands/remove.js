const { ApplicationCommandOptionType } = require('discord.js');
const { ERRORS, MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'remove',
        description: 'Removes a song from the queue',
        options: [
            {
                name: 'number',
                type: ApplicationCommandOptionType.Integer,
                description: 'Remove specific song number from queue',
                required: true
            }
        ]
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        const songNumber = interaction.options.get('number').value;
        
        // Validate song number exists in queue
        if (songNumber < 0 || songNumber >= guildQueue.songs.length) {
            await sendTemporaryReply(interaction, ERRORS.INVALID_SONG_NUMBER(guildQueue.songs.length));
            return;
        }
        
        guildQueue.remove(songNumber);
        await sendTemporaryReply(interaction, MESSAGES.REMOVED(songNumber));
    }
};
