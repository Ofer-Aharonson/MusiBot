// Volume Command - Adjust playback volume
const { ApplicationCommandOptionType } = require('discord.js');

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
                const reply = await interaction.reply({
                    content: '❌ Nothing is playing!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Check if there's a current resource
            if (!guildData.currentResource) {
                const reply = await interaction.reply({
                    content: '❌ No audio resource available!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Set volume (convert percentage to decimal: 100 = 1.0, 200 = 2.0)
            const volumeDecimal = volume / 100;
            
            // Store volume setting
            guildData.volume = volumeDecimal;
            
            // Apply volume if resource supports it
            if (guildData.currentResource.volume) {
                guildData.currentResource.volume.setVolume(volumeDecimal);
            }
            
            const reply = await interaction.reply({
                content: `🔊 Volume set to ${volume}%`,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Volume command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
