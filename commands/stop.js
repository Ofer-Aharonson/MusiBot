// Stop Command - Stop playback and disconnect

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
                const reply = await interaction.reply({
                    content: '❌ Nothing is playing!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Stop playback
            guildData.player.stop();
            
            // Disconnect from voice channel
            if (guildData.connection) {
                guildData.connection.destroy();
            }
            
            // Clean up tracking data
            client.stats.voiceConnections.delete(interaction.guild.id);
            
            const reply = await interaction.reply({
                content: '⏹️ Stopped and disconnected!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Stop command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
