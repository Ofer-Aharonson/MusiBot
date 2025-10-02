// Queue Loop Command - Toggle loop for entire queue

module.exports = {
    data: {
        name: 'queue-loop',
        description: 'Toggle loop for the entire queue'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            
            // Check if there's an active queue
            if (!queue) {
                const reply = await interaction.reply({
                    content: '❌ No queue found!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Check if queue has songs
            if (!queue.tracks || queue.tracks.length === 0) {
                const reply = await interaction.reply({
                    content: '❌ Queue is empty!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Toggle queue loop mode
            queue.queueLoop = !queue.queueLoop;
            
            // If enabling queue loop, disable track loop
            if (queue.queueLoop) {
                queue.loop = false;
            }
            
            const reply = await interaction.reply({
                content: queue.queueLoop 
                    ? '🔁 Queue loop enabled!' 
                    : '➡️ Queue loop disabled!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Queue loop command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
