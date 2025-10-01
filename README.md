<div align="center">

# 🎵 MusiBot

**A modern Discord music bot built with Discord.js v14**

[![Node.js](https://img.shields.io/badge/Node.js-16.9.0+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Play YouTube music in your Discord server with slash commands*

[Features](#-features) • [Installation](#-installation) • [Commands](#-commands) • [Configuration](#-configuration)

</div>

---

## ✨ Features

🎵 **YouTube Integration** - Play songs directly from YouTube  
⚡ **Slash Commands** - Modern Discord UI with autocomplete  
📋 **Queue System** - Add, remove, shuffle, and manage your playlist  
🔁 **Loop Modes** - Loop single songs or entire queue  
🔊 **Volume Control** - Adjust playback volume (0-200%)  
⏩ **Seek & Skip** - Jump to any point in a song  
�️ **Modular Architecture** - Clean, maintainable code structure  
🔒 **Secure** - Environment variables for credentials  

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16.9.0 or higher
- A Discord bot token ([Get one here](https://discord.com/developers/applications))

### Setup

```bash
# Clone the repository
git clone https://github.com/Ofer-Aharonson/MusiBot.git
cd MusiBot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your bot token and client ID

# Start the bot
node index.js
```

### Getting Your Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" → Reset Token → Copy
4. Paste into `.env` file
5. Enable these intents: `GUILD_VOICE_STATES`, `GUILDS`



## 🎮 Commands

### Playback
- `/play <query>` - Play a song from YouTube (URL or search)
- `/pause` - Pause the current song
- `/resume` - Resume playback
- `/skip` - Skip to the next song
- `/stop` - Stop playback and clear queue
- `/seek <seconds>` - Jump to a specific time in the song

### Queue Management
- `/remove <position>` - Remove a song from the queue
- `/shuffle` - Randomize queue order
- `/clear-queue` - Remove all songs from queue
- `/end` - End the current queue

### Loop & Volume
- `/loop` - Toggle loop for current song
- `/queue-loop` - Toggle loop for entire queue
- `/stop-loop` - Disable all loop modes
- `/set-volume <0-200>` - Adjust playback volume

## 🛠️ Development

### Project Structure
```
MusiBot/
├── commands/      # 14 slash commands
├── config/        # Configuration & constants
├── events/        # Discord event handlers
├── handlers/      # Dynamic command/event loaders
├── utils/         # Helper functions & logging
└── index.js       # Bot entry point
```

### Adding Commands

1. Create a file in `commands/yourcommand.js`:
```js
module.exports = {
    data: {
        name: 'yourcommand',
        description: 'Your command description'
    },
    async execute(interaction, client) {
        // Your logic here
    }
};
```

2. Restart the bot - it auto-loads new commands!

## ⚙️ Configuration

Customize your bot in `.env`:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
MESSAGE_DELETE_TIMEOUT=15000
VOLUME_MIN=0
VOLUME_MAX=200
```

## 🏗️ Architecture

Built with best practices:
- ✅ Modular design - each command is a separate file
- ✅ Environment variables for security
- ✅ Comprehensive error handling
- ✅ ESLint & Prettier for code quality
- ✅ Helper functions to reduce code duplication

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Tech Stack

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [discord-music-player](https://www.npmjs.com/package/discord-music-player) - Music playback
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables

---

<div align="center">

**[⬆ Back to Top](#-musibot)**

Made with ❤️ for Discord communities

</div>
