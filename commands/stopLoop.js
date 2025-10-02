// Stop Loop Command - Disable all loop modes
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'stop-loop',
        description: 'Disable all loop modes'
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
            
            // Check if any loop is active
            if (!queue.loop && !queue.queueLoop) {
                return await interaction.reply({
                    content: '❌ No loop is active!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Disable all loop modes
            queue.loop = false;
            queue.queueLoop = false;
            
            await interaction.reply({
                content: '⏹️ All loop modes disabled!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('Stop loop command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
