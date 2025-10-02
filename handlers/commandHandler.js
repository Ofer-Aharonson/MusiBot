const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const logger = require('../utils/logger');

/**
 * Loads all command files from the commands directory
 * @returns {Map} Map of command names to command modules
 */
function loadCommands() {
    const commands = new Map();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
            logger.info(`Loaded command: ${command.data.name}`);
        } else {
            logger.warn(`Command at ${filePath} is missing required "data" or "execute" property`);
        }
    }
    
    return commands;
}

/**
 * Registers all commands with Discord API
 * @param {string} token - Discord bot token
 * @param {string} clientId - Discord client ID
 * @param {Map} commands - Map of commands to register
 */
async function registerCommands(token, clientId, commands) {
    const commandsData = Array.from(commands.values()).map(cmd => cmd.data);
    const rest = new REST().setToken(token);
    
    try {
        logger.info(`Started refreshing ${commandsData.length} application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commandsData }
        );
        
        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        logger.error('Error registering commands:', error);
    }
}

module.exports = {
    loadCommands,
    registerCommands
};
