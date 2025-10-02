// Resume Command - Resume paused playback

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
                const reply = await interaction.reply({
                    content: '❌ Nothing is playing!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Resume playback
            guildData.player.unpause();
            
            const reply = await interaction.reply({
                content: '▶️ Resumed!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Resume command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
