// Shuffle Command - Randomize queue order
const { MessageFlags } = require('discord.js');

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
                return await interaction.reply({
                    content: '❌ The queue is empty!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Need at least 2 songs to shuffle
            if (queue.tracks.length < 2) {
                return await interaction.reply({
                    content: '❌ Need at least 2 songs in queue to shuffle!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Fisher-Yates shuffle algorithm
            const tracks = queue.tracks;
            for (let i = tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
            
            await interaction.reply({
                content: `🔀 Shuffled ${tracks.length} song(s) in the queue!`,
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Shuffle command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
