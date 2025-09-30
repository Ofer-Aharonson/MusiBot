const { ApplicationCommandOptionType } = require('discord.js');
const { VOLUME_MIN, VOLUME_MAX, ERRORS, MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'set-volume',
        description: 'Set the volume of the player',
        options: [
            {
                name: 'volume',
                type: ApplicationCommandOptionType.Integer,
                description: 'Sets the volume to number mentioned',
                required: true
            }
        ]
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        const volume = interaction.options.get('volume').value;
        
        // Validate volume range
        if (volume < VOLUME_MIN || volume > VOLUME_MAX) {
            await sendTemporaryReply(interaction, ERRORS.VOLUME_OUT_OF_RANGE(VOLUME_MIN, VOLUME_MAX));
            return;
        }
        
        guildQueue.setVolume(volume);
        await sendTemporaryReply(interaction, MESSAGES.VOLUME_SET(volume));
    }
};
