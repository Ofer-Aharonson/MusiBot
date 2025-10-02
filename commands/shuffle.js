// Shuffle Command - Randomize queue order

module.exports = {
    data: {
        name: 'shuffle',
        description: 'Randomize the queue order'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            
            // Check if queue exists and has songs
            if (!queue || !queue.tracks || queue.tracks.length === 0) {
                const reply = await interaction.reply({
                    content: '❌ The queue is empty!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Need at least 2 songs to shuffle
            if (queue.tracks.length < 2) {
                const reply = await interaction.reply({
                    content: '❌ Need at least 2 songs in queue to shuffle!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Fisher-Yates shuffle algorithm
            const tracks = queue.tracks;
            for (let i = tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
            
            const reply = await interaction.reply({
                content: `🔀 Shuffled ${tracks.length} song(s) in the queue!`,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Shuffle command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
