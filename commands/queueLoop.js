// Queue Loop Command - Toggle loop for entire queue
const { MessageFlags } = require('discord.js');

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
                return await interaction.reply({
                    content: '❌ No queue found!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Check if queue has songs
            if (!queue.tracks || queue.tracks.length === 0) {
                return await interaction.reply({
                    content: '❌ Queue is empty!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Toggle queue loop mode
            queue.queueLoop = !queue.queueLoop;
            
            // If enabling queue loop, disable track loop
            if (queue.queueLoop) {
                queue.loop = false;
            }
            
            await interaction.reply({
                content: queue.queueLoop 
                    ? '🔁 Queue loop enabled!' 
                    : '➡️ Queue loop disabled!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Queue loop command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
