# MusiBot 🎶

A professional Discord music bot for playing YouTube songs, built with Discord.js v14 and following industry best practices.

## ✨ Features

- 🎵 Play songs from YouTube (URLs or search queries)
- 📋 Queue management (add, remove, shuffle, clear)
- 🔁 Loop modes (song and queue)
- ⏯️ Playback controls (pause, resume, skip, stop)
- 🔊 Volume control (0-200)
- ⏩ Seek to specific time in songs
- 🎲 Shuffle queue
- 📱 Slash commands (modern Discord UI)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.9.0 or higher)
- A Discord bot token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sunflames/MusiBot.git
   cd MusiBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Your `.env` file is already set up. If you need to change it:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   ```

4. **Run the bot**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
MusiBot/
├── commands/          # Individual command files
│   ├── play.js        # Play music from YouTube
│   ├── skip.js        # Skip current song
│   ├── pause.js       # Pause playback
│   ├── resume.js      # Resume playback
│   ├── stop.js        # Stop and clear queue
│   ├── volume.js      # Set volume
│   ├── loop.js        # Loop current song
│   ├── queueLoop.js   # Loop entire queue
│   ├── stopLoop.js    # Stop looping
│   ├── seek.js        # Seek in song
│   ├── remove.js      # Remove song from queue
│   ├── shuffle.js     # Shuffle queue
│   ├── clearQueue.js  # Clear all songs
│   └── end.js         # End queue
├── config/            # Configuration files
│   ├── constants.js   # Messages and settings
│   └── index.js       # Main config loader
├── events/            # Discord event handlers
│   ├── ready.js       # Bot ready event
│   └── interactionCreate.js  # Command handler
├── handlers/          # Dynamic loaders
│   ├── commandHandler.js  # Load commands
│   └── eventHandler.js    # Load events
├── utils/             # Helper functions
│   ├── queueHelper.js # Queue utilities
│   └── logger.js      # Logging utility
└── index.js           # Main entry point
```

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `/play <query>` | Play a song from YouTube |
| `/skip` | Skip the current song |
| `/stop` | Stop playback and clear queue |
| `/pause` | Pause the current song |
| `/resume` | Resume playback |
| `/set-volume <0-200>` | Set playback volume |
| `/loop` | Loop the current song |
| `/queue-loop` | Loop the entire queue |
| `/stop-loop` | Disable loop mode |
| `/seek <seconds>` | Jump to specific time |
| `/remove <number>` | Remove song from queue |
| `/shuffle` | Shuffle the queue |
| `/clear-queue` | Clear all songs |
| `/end` | End the queue |

## 🛠️ Development

### Scripts

```bash
npm start        # Run the bot
npm run dev      # Run with auto-restart (requires nodemon)
npm run lint     # Check code quality
npm run lint:fix # Auto-fix linting issues
npm run format   # Format code with Prettier
```

### Adding New Commands

Create a new file in `commands/` folder:

```javascript
const { MESSAGES } = require('../config/constants');
const { getQueueOrReply, sendTemporaryReply } = require('../utils/queueHelper');

module.exports = {
    data: {
        name: 'your-command',
        description: 'Command description'
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const guildQueue = await getQueueOrReply(interaction, client);
        if (!guildQueue) return;
        
        // Your command logic here
        
        await sendTemporaryReply(interaction, 'Success!');
    }
};
```

Restart the bot - the command will automatically load!

## ⚙️ Configuration

Edit `.env` file to customize:

```env
# Discord Bot
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id

# Bot Behavior
MESSAGE_DELETE_TIMEOUT=15000  # Auto-delete messages after 15s
LEAVE_ON_EMPTY=false          # Stay in voice when empty
VOLUME_MIN=0                  # Minimum volume
VOLUME_MAX=200                # Maximum volume
```

Edit `config/constants.js` to customize messages.

## 🏗️ Architecture

This bot follows modern JavaScript best practices:

- ✅ **Modular Design** - Each command is a separate file
- ✅ **DRY Principle** - No code repetition
- ✅ **Environment Variables** - Secure configuration
- ✅ **Error Handling** - Comprehensive try-catch blocks
- ✅ **Logging** - Professional logging with timestamps
- ✅ **JSDoc** - Full documentation
- ✅ **Code Quality** - ESLint and Prettier configured
- ✅ **Graceful Shutdown** - Proper cleanup on exit

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Fast setup instructions
- [Refactor Guide](REFACTOR_GUIDE.md) - Detailed documentation

## 🆘 Support

If you encounter any issues:
1. Check that `.env` has correct tokens
2. Ensure all dependencies are installed: `npm install`
3. Verify Node.js version: `node --version` (should be v16.9.0+)

## 🎉 Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Music playback powered by [discord-music-player](https://www.npmjs.com/package/discord-music-player)

---

Made with ❤️ by [Sunflames](https://github.com/Sunflames)
