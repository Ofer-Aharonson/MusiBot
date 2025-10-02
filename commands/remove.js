// Remove Command - Remove a song from the queue by position
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: {
        name: 'remove',
        description: 'Remove a song from the queue',
        options: [{
            name: 'position',
            type: ApplicationCommandOptionType.Integer,
            description: 'Position in queue to remove (1 = first song)',
            required: true,
            minValue: 1
        }]
    },
    
    async execute(interaction, client) {
        try {
            const position = interaction.options.getInteger('position');
            
            // Get queue for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            
            // Check if queue exists
            if (!queue || !queue.tracks || queue.tracks.length === 0) {
                const reply = await interaction.reply({
                    content: '❌ The queue is empty!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Check if position is valid
            if (position > queue.tracks.length) {
                const reply = await interaction.reply({
                    content: `❌ Invalid position! Queue has only ${queue.tracks.length} song(s).`,
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Remove the song (position is 1-based, array is 0-based)
            const removed = queue.tracks.splice(position - 1, 1)[0];
            
            const reply = await interaction.reply({
                content: `🗑️ Removed from queue: **${removed.title || 'Unknown Track'}**`,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Remove command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
