// End Command - End the current queue

module.exports = {
    data: {
        name: 'end',
        description: 'End the current queue'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue and voice data for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            const guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            // Check if there's anything to end
            if (!queue && !guildData) {
                const reply = await interaction.reply({
                    content: '❌ Nothing to end!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Clear queue
            if (queue) {
                queue.tracks = [];
                queue.loop = false;
                queue.queueLoop = false;
            }
            
            // Stop playback if active
            if (guildData && guildData.player) {
                guildData.player.stop();
            }
            
            // Disconnect from voice
            if (guildData && guildData.connection) {
                guildData.connection.destroy();
            }
            
            // Clean up
            client.stats.queues.delete(interaction.guild.id);
            client.stats.voiceConnections.delete(interaction.guild.id);
            
            const reply = await interaction.reply({
                content: '⏹️ Queue ended and disconnected!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('End command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
