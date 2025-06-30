/**
 * Disconnect command - Disconnects the bot from the voice channel
 */

const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

// Access to the global collections
const players = global.players || new Map();
const queues = global.queues || new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects the bot from the voice channel'),
    
  async execute(interaction) {
    // Check if the user is in a voice channel
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: '❌ You need to be in a voice channel to use this command!', ephemeral: true });
    }
    
    // Get the voice connection for this guild
    const connection = getVoiceConnection(interaction.guildId);
    
    if (!connection) {
      return interaction.reply({ content: '❌ I\'m not currently in a voice channel!', ephemeral: true });
    }
    
    // Disconnect from the voice channel
    connection.destroy();
    
    // Clear any stored players/queues for this guild
    if (global.players && global.players.has(interaction.guildId)) {
      global.players.delete(interaction.guildId);
    }
    
    if (global.queues && global.queues.has(interaction.guildId)) {
      global.queues.delete(interaction.guildId);
    }
    
    return interaction.reply('👋 Disconnected from the voice channel!');
  },
};
