// End Command - End the current queue
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'end',
        description: 'End the current queue'
    },
    
    async execute(interaction, client) {
        try {
            // Get queue and voice data for this guild
            const queue = client.stats.queues.get(interaction.guild.id);
            const guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            // Check if there's anything to end
            if (!queue && !guildData) {
                return await interaction.reply({
                    content: '❌ Nothing to end!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Clear queue
            if (queue) {
                queue.tracks = [];
                queue.loop = false;
                queue.queueLoop = false;
            }
            
            // Stop playback if active
            if (guildData && guildData.player) {
                guildData.player.stop();
            }
            
            // Disconnect from voice
            if (guildData && guildData.connection) {
                guildData.connection.destroy();
            }
            
            // Clean up
            client.stats.queues.delete(interaction.guild.id);
            client.stats.voiceConnections.delete(interaction.guild.id);
            
            await interaction.reply({
                content: '⏹️ Queue ended and disconnected!',
                flags: MessageFlags.Ephemeral
            });
            
        } catch (error) {
            console.error('End command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
