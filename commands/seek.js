const { ApplicationCommandOptionType } = require('discord.js');
const { ERRORS, MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'seek',
        description: 'Move to a certain second on current song',
        options: [
            {
                name: 'seconds',
                type: ApplicationCommandOptionType.Integer,
                description: 'Goes to the specific time in seconds of the song',
                required: true
            }
        ]
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        const seconds = interaction.options.get('seconds').value;
        
        // Validate seek time
        if (seconds < 0) {
            await sendTemporaryReply(interaction, ERRORS.SEEK_NEGATIVE);
            return;
        }
        
        guildQueue.seek(seconds * 1000);
        await sendTemporaryReply(interaction, MESSAGES.SEEKING(seconds));
    }
};
