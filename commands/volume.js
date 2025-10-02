// Volume Command - Adjust playback volume
const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'set-volume',
        description: 'Adjust playback volume',
        options: [{
            name: 'level',
            type: ApplicationCommandOptionType.Integer,
            description: 'Volume level (0-200)',
            required: true,
            minValue: 0,
            maxValue: 200
        }]
    },
    
    async execute(interaction, client) {
        try {
            const volume = interaction.options.getInteger('level');
            
            // Get voice connection data for this guild
            const guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            // Check if bot is in voice channel
            if (!guildData || !guildData.player) {
                return await interaction.reply({
                    content: '❌ Nothing is playing!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Check if there's a current resource
            if (!guildData.currentResource) {
                return await interaction.reply({
                    content: '❌ No audio resource available!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Set volume (convert percentage to decimal: 100 = 1.0, 200 = 2.0)
            const volumeDecimal = volume / 100;
            
            // Store volume setting
            guildData.volume = volumeDecimal;
            
            // Apply volume if resource supports it
            if (guildData.currentResource.volume) {
                guildData.currentResource.volume.setVolume(volumeDecimal);
            }
            
            await interaction.reply({
                content: `🔊 Volume set to ${volume}%`,
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Volume command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
