const { GuildMember } = require('discord.js');
const { ERRORS } = require('../config/constants');
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Ignore if not a command or not in a guild
        if (!interaction.isCommand() || !interaction.guildId) return;
        
        // Verify user is in a voice channel
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return interaction.reply({ 
                content: ERRORS.NO_VOICE_CHANNEL, 
                ephemeral: true 
            });
        }
        
        // Get the command from the client's command collection
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            logger.warn(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        
        try {
            await command.execute(interaction, client);
        } catch (error) {
            logger.error(`Error executing ${interaction.commandName}:`, error);
            
            const errorMessage = { content: 'There was an error executing this command!', ephemeral: true };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
