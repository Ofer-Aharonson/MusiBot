// Pause Command - Pause playback
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'pause',
        description: 'Pause the current track'
    },
    
    async execute(interaction, client) {
        try {
            // Get voice connection data for this guild
            const guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            // Check if bot is in voice channel
            if (!guildData || !guildData.player) {
                return await interaction.reply({
                    content: '❌ Nothing is playing!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Pause playback
            guildData.player.pause();
            
            await interaction.reply({
                content: '⏸️ Paused!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Pause command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
