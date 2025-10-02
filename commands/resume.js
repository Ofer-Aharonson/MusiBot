// Resume Command - Resume paused playback
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'resume',
        description: 'Resume paused playback'
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
            
            // Resume playback
            guildData.player.unpause();
            
            await interaction.reply({
                content: '▶️ Resumed!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Resume command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
