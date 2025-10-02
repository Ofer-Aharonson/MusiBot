// Interaction Create Event - Handles slash commands and buttons
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Handle button clicks
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('play_')) {
                const playCommand = client.commands.get('play');
                if (playCommand && playCommand.handleButtonInteraction) {
                    return await playCommand.handleButtonInteraction(interaction, client);
                }
            }
            return;
        }
        
        // Handle slash commands
        if (!interaction.isCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        
        try {
            client.stats.commandsExecuted++;
            await command.execute(interaction, client);
        } catch (error) {
            console.error('Command error:', error);
            const errorMsg = { content: 'Error!', flags: MessageFlags.Ephemeral };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        }
    }
};
