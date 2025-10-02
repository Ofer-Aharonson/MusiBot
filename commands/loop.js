// Loop Command - Toggle loop for current song

module.exports = {
    data: {
        name: 'loop',
        description: 'Toggle loop for the current song'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            
            // Check if there's an active queue
            if (!queue) {
                const reply = await interaction.reply({
                    content: '❌ Nothing is playing!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Toggle loop mode
            queue.loop = !queue.loop;
            
            // If enabling track loop, disable queue loop
            if (queue.loop) {
                queue.queueLoop = false;
            }
            
            const reply = await interaction.reply({
                content: queue.loop 
                    ? '🔂 Loop enabled for current song!' 
                    : '➡️ Loop disabled for current song!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Loop command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
