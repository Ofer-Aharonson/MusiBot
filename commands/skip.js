// Skip Command - Skip to next track
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'skip',
        description: 'Skip the current track'
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
            
            // Skip by stopping current track
            guildData.player.stop();
            
            await interaction.reply({
                content: '⏭️ Skipped!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Skip command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
