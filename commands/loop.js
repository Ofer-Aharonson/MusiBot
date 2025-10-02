// Loop Command - Toggle loop for current song
const { MessageFlags } = require('discord.js');

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
                return await interaction.reply({
                    content: '❌ Nothing is playing!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Toggle loop mode
            queue.loop = !queue.loop;
            
            // If enabling track loop, disable queue loop
            if (queue.loop) {
                queue.queueLoop = false;
            }
            
            await interaction.reply({
                content: queue.loop 
                    ? '🔂 Loop enabled for current song!' 
                    : '➡️ Loop disabled for current song!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Loop command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
