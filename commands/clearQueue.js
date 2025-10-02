// Clear Queue Command - Remove all songs from the queue
const { MessageFlags } = require('discord.js');

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
                return await interaction.reply({
                    content: '❌ The queue is already empty!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Store count before clearing
            const count = queue.tracks.length;
            
            // Clear the queue
            queue.tracks = [];
            
            await interaction.reply({
                content: `🗑️ Cleared ${count} song(s) from the queue!`,
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Clear queue command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
