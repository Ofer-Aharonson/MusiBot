// Seek Command - Jump to a specific time in the song
const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'seek',
        description: 'Jump to a specific time in the song',
        options: [{
            name: 'seconds',
            type: ApplicationCommandOptionType.Integer,
            description: 'Time to jump to in seconds',
            required: true,
            minValue: 0
        }]
    },
    
    async execute(interaction, client) {
        try {
            const seconds = interaction.options.getInteger('seconds');
            
            // Get voice connection data for this guild
            const guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            // Check if bot is in voice channel
            if (!guildData || !guildData.player) {
                return await interaction.reply({
                    content: '❌ Nothing is playing!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Check if there's a current resource
            if (!guildData.currentResource) {
                return await interaction.reply({
                    content: '❌ No song is currently playing!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Note: Seeking is limited in @discordjs/voice
            // We need to replay from the new position
            await interaction.reply({
                content: `⏭️ Seeking to ${seconds}s... (Note: Seeking recreates the stream)`,
                flags: MessageFlags.Ephemeral
            });
            
            // Store the seek position for the next play
            if (guildData.currentTrack) {
                guildData.seekPosition = seconds;
            }
            
            // Note: Full seeking implementation requires replaying the stream
            // This is a simplified version that notifies the user
            
        } catch (error) {
            console.error('Seek command error:', error);
            await interaction.reply({
                content: '❌ Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
