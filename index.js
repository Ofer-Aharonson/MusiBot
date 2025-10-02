// MusiBot v3.0.0 - Main entry point
require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const express = require('express');
const fs = require('fs');
const path = require('path');
const play = require('play-dl');

const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    webPort: 8080
};

if (!config.token || !config.clientId) {
    console.error('Missing DISCORD_TOKEN or CLIENT_ID');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();
client.stats = {
    startTime: Date.now(),
    commandsExecuted: 0,
    voiceConnections: new Map(),
    queues: new Map()
};

console.log('MusiBot v3.0.0 - Starting...');

// Initialize play-dl for SoundCloud
(async () => {
    try {
        console.log('🔄 Initializing SoundCloud...');
        const clientId = await play.getFreeClientID();
        console.log('📡 Got SoundCloud client ID');
        await play.setToken({
            soundcloud: {
                client_id: clientId
            }
        });
        console.log('✅ SoundCloud initialized successfully');
    } catch (error) {
        console.error('⚠️ SoundCloud init warning:', error.message);
        console.error('⚠️ SoundCloud features may not work');
    }
})();

client.login(config.token);

// ==================== COMMAND HOT-RELOADING ====================
function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
        return;
    }
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log('Loading ' + commandFiles.length + ' command(s)...');
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                console.log('  ✅ ' + command.data.name);
            }
        } catch (error) {
            console.error('  ❌ ' + file + ': ' + error.message);
        }
    }
}

async function registerCommands() {
    const commands = [];
    client.commands.forEach(cmd => commands.push(cmd.data));
    if (commands.length === 0) {
        console.log('⚠️ No commands to register');
        return;
    }
    console.log('📝 Registering ' + commands.length + ' commands...');
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('🔄 Sending commands to Discord API...');
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
        console.log('✅ Registered ' + commands.length + ' commands');
    } catch (error) {
        console.error('❌ Register error:', error.message);
        console.error('❌ Commands may not work in Discord');
        // Don't exit here, let the bot continue
    }
}

// ==================== EVENT LOADING ====================
function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        return;
    }
    client.removeAllListeners();
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    console.log('Loading ' + eventFiles.length + ' event(s)...');
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        try {
            delete require.cache[require.resolve(filePath)];
            const event = require(filePath);
            if (event.name && event.execute) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log('  ✅ ' + event.name);
            }
        } catch (error) {
            console.error('  ❌ ' + file + ': ' + error.message);
        }
    }
}

// ==================== WEB DASHBOARD ====================
const app = express();
app.get('/', (req, res) => {
    const uptime = Math.floor((Date.now() - client.stats.startTime) / 1000);
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = uptime % 60;
    res.send('<html><head><title>MusiBot</title><meta charset=\"UTF-8\"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;min-height:100vh;padding:20px}.container{max-width:1200px;margin:0 auto}h1{text-align:center;font-size:3em;margin-bottom:40px}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}.stat-card{background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:15px;padding:25px;border:1px solid rgba(255,255,255,0.2)}.stat-label{opacity:0.8;margin-bottom:10px}.stat-value{font-size:2.5em;font-weight:bold}.status-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#4ade80;margin-right:8px;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}.connections{background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:15px;padding:25px;border:1px solid rgba(255,255,255,0.2);margin-top:20px}.footer{text-align:center;margin-top:40px;opacity:0.7}</style></head><body><div class=\"container\"><h1>🎵 MusiBot Dashboard</h1><div class=\"stats\"><div class=\"stat-card\"><div class=\"stat-label\">Status</div><div class=\"stat-value\"><span class=\"status-dot\"></span>Online</div></div><div class=\"stat-card\"><div class=\"stat-label\">Uptime</div><div class=\"stat-value\">' + h + 'h ' + m + 'm ' + s + 's</div></div><div class=\"stat-card\"><div class=\"stat-label\">Servers</div><div class=\"stat-value\">' + client.guilds.cache.size + '</div></div><div class=\"stat-card\"><div class=\"stat-label\">Commands</div><div class=\"stat-value\">' + client.stats.commandsExecuted + '</div></div></div><div class=\"connections\"><h2>🎤 Active Connections</h2><p style=\"opacity:0.7;margin-top:10px\">' + (client.stats.voiceConnections.size === 0 ? 'No active connections' : client.stats.voiceConnections.size + ' active') + '</p></div><div class=\"footer\"><p>Auto-refresh in 5s | MusiBot v3.0.0</p></div></div><script>setTimeout(()=>location.reload(),5000)</script></body></html>');
});
app.listen(config.webPort, () => console.log('🌐 Dashboard: http://localhost:' + config.webPort));

// ==================== STARTUP ====================
client.once('ready', async () => {
    console.log('✅ Bot online: ' + client.user.tag);
    await loadCommands();
    await loadEvents();
    await registerCommands();
    console.log('🎉 Bot fully initialized and ready!');
});

client.on('error', (error) => {
    console.error('❌ Discord client error:', error);
});

client.on('disconnect', () => {
    console.log('⚠️ Bot disconnected from Discord');
});

client.on('reconnecting', () => {
    console.log('🔄 Bot reconnecting to Discord...');
});

client.on('warn', (warning) => {
    console.warn('⚠️ Discord warning:', warning);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT - Shutting down gracefully...');
    client.stats.voiceConnections.forEach((data) => {
        if (data.connection) data.connection.destroy();
    });
    await client.destroy();
    console.log('✅ Shutdown complete');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM - Shutting down gracefully...');
    client.stats.voiceConnections.forEach((data) => {
        if (data.connection) data.connection.destroy();
    });
    await client.destroy();
    console.log('✅ Shutdown complete');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Hot reload functions
client.reloadCommands = () => { loadCommands(); registerCommands(); };
client.reloadEvents = () => loadEvents();
