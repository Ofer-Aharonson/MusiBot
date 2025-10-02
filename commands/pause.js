// Pause Command - Pause playback

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
                const reply = await interaction.reply({
                    content: '❌ Nothing is playing!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Pause playback
            guildData.player.pause();
            
            const reply = await interaction.reply({
                content: '⏸️ Paused!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Pause command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
