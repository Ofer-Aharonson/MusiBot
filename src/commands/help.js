/**
 * Help command - Displays information about available commands
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays information about available commands'),
    
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('MusiBot Commands')
      .setDescription('Here are the available commands for MusiBot:')
      .addFields(
        { name: '/play <query>', value: 'Searches YouTube for your query or plays a direct YouTube URL' },
        { name: '/disconnect', value: 'Disconnects the bot from the voice channel' },
        { name: '/help', value: 'Shows this help message' },
      )
      .setFooter({ text: 'More commands coming soon!' });
      
    await interaction.reply({ embeds: [embed] });
  },
};
