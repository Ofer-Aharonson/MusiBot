// Stop Loop Command - Disable all loop modes

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
                const reply = await interaction.reply({
                    content: '❌ No queue found!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Check if any loop is active
            if (!queue.loop && !queue.queueLoop) {
                const reply = await interaction.reply({
                    content: '❌ No loop is active!',
                    fetchReply: true
                });
                setTimeout(() => reply.delete().catch(() => {}), 10000);
                return;
            }
            
            // Disable all loop modes
            queue.loop = false;
            queue.queueLoop = false;
            
            const reply = await interaction.reply({
                content: '⏹️ All loop modes disabled!',
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
            
        } catch (error) {
            console.error('Stop loop command error:', error);
            const reply = await interaction.reply({
                content: '❌ Error: ' + error.message,
                fetchReply: true
            });
            setTimeout(() => reply.delete().catch(() => {}), 10000);
        }
    }
};
