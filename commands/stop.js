// Stop Command - Stop playback and disconnect
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'stop',
        description: 'Stop playback and disconnect from voice channel'
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
            
            // Stop playback
            guildData.player.stop();
            
            // Disconnect from voice channel
            if (guildData.connection) {
                guildData.connection.destroy();
            }
            
            // Clean up tracking data
            client.stats.voiceConnections.delete(interaction.guild.id);
            
            await interaction.reply({
                content: '⏹️ Stopped and disconnected!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Stop command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
