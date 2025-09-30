// Load environment variables first
require('dotenv').config();

// Import Discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-music-player');

// Import configuration
const config = require('./config');
const logger = require('./utils/logger');

// Import handlers
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

// Validate environment variables
if (!config.token || !config.clientId) {
    logger.error('Missing required environment variables: DISCORD_TOKEN and/or CLIENT_ID');
    logger.info('Please create a .env file based on .env.example');
    process.exit(1);
}

// Create Discord client with necessary permissions
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Create music player instance
const player = new Player(client, {
    leaveOnEmpty: config.LEAVE_ON_EMPTY
});

// Attach player to client for easy access
client.player = player;

// Load commands and events
client.commands = loadCommands(client);
loadEvents(client);

// Register commands with Discord
registerCommands(config.token, config.clientId, client.commands);

// Login to Discord
client.login(config.token);

// Graceful shutdown handler
process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    
    // Disconnect from all voice channels
    if (client.player) {
        const queues = client.player.getQueue();
        if (queues) {
            queues.stop();
        }
    }
    
    // Destroy client
    client.destroy();
    logger.info('Bot shut down successfully');
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
});
