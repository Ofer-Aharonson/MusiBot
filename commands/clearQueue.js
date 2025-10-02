// Clear Queue Command - Remove all songs from the queue

module.exports = {
    data: {
        name: 'clear-queue',
        description: 'Remove all songs from the queue'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            
            // Check if queue exists
            if (!queue || !queue.tracks || queue.tracks.length === 0) {
                const reply = await interaction.reply({
                    content: '❌ The queue is already empty!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Store count before clearing
            const count = queue.tracks.length;
            
            // Clear the queue
            queue.tracks = [];
            
            const reply = await interaction.reply({
                content: `🗑️ Cleared ${count} song(s) from the queue!`,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Clear queue command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
