# 🎵 MusiBot v3.0.0

A powerful Discord music bot with SoundCloud integration, queue management, and advanced playback controls.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-blue.svg)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎧 Playback Controls
- **Play from SoundCloud** - Search and play tracks with interactive button selection
- **Queue System** - Automatic queue management with auto-advance
- **Pause/Resume** - Control playback at any time
- **Skip** - Jump to the next track in queue
- **Stop** - Stop playback and disconnect
- **Seek** - Jump to specific time in a track

### 📋 Queue Management
- **Add to Queue** - Songs automatically queue when playing
- **Remove** - Remove specific songs by position
- **Shuffle** - Randomize queue order
- **Clear Queue** - Remove all songs from queue
- **End** - End queue and disconnect

### 🔁 Loop Modes
- **Track Loop** - Repeat current song
- **Queue Loop** - Repeat entire queue
- **Stop Loop** - Disable all loop modes

### 🔊 Audio Control
- **Volume Control** - Adjust volume from 0-200%
- **Smart Playback** - Automatic track advancement
- **Quality Audio** - High-quality SoundCloud streaming

### 📊 Web Dashboard
- **Real-time Stats** - Monitor bot uptime and usage
- **Server Count** - Track connected servers
- **Command Stats** - View command execution count
- **Active Connections** - See current voice connections
- **Auto-refresh** - Updates every 5 seconds

## 📋 Commands

### Playback Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/play` | Search and play from SoundCloud | `/play <song name>` |
| `/pause` | Pause current playback | `/pause` |
| `/resume` | Resume playback | `/resume` |
| `/skip` | Skip to next song | `/skip` |
| `/stop` | Stop and disconnect | `/stop` |
| `/seek` | Jump to specific time | `/seek <seconds>` |

### Queue Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/remove` | Remove song from queue | `/remove <position>` |
| `/shuffle` | Randomize queue order | `/shuffle` |
| `/clear-queue` | Clear all songs from queue | `/clear-queue` |
| `/end` | End queue and disconnect | `/end` |

### Loop Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/loop` | Toggle loop for current song | `/loop` |
| `/queue-loop` | Toggle loop for entire queue | `/queue-loop` |
| `/stop-loop` | Disable all loop modes | `/stop-loop` |

### Volume Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/set-volume` | Adjust playback volume | `/set-volume <0-200>` |

## 🚀 Installation

### Prerequisites
- Node.js v16.0.0 or higher
- Discord Bot Token
- Discord Application with Bot enabled

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ofer-Aharonson/MusiBot.git
   cd MusiBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_application_id_here
   MESSAGE_DELETE_TIMEOUT=15000
   VOLUME_MIN=0
   VOLUME_MAX=200
   ```

4. **Get your Discord credentials**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select an existing one
   - Go to the **Bot** section and copy your token
   - Go to **OAuth2** → **General** and copy your Client ID

5. **Invite the bot to your server**
   - Go to OAuth2 → URL Generator
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: 
     - `View Channels`
     - `Send Messages`
     - `Connect`
     - `Speak`
     - `Use Voice Activity`
   - Copy and visit the generated URL

6. **Start the bot**
   ```bash
   node index.js
   ```

## 📊 Web Dashboard

The bot includes a web dashboard accessible at `http://localhost:8080` that shows:
- Bot online status
- Uptime counter
- Connected server count
- Command execution statistics
- Active voice connections

## 🏗️ Project Structure

```
MusiBot/
├── commands/           # Slash command handlers
│   ├── play.js        # SoundCloud search & playback
│   ├── pause.js       # Pause playback
│   ├── resume.js      # Resume playback
│   ├── skip.js        # Skip to next track
│   ├── stop.js        # Stop and disconnect
│   ├── seek.js        # Seek to time
│   ├── remove.js      # Remove from queue
│   ├── shuffle.js     # Shuffle queue
│   ├── clearQueue.js  # Clear queue
│   ├── end.js         # End queue
│   ├── loop.js        # Toggle track loop
│   ├── queueLoop.js   # Toggle queue loop
│   ├── stopLoop.js    # Stop all loops
│   └── volume.js      # Set volume
├── config/            # Configuration files
│   └── constants.js   # Bot constants
├── events/            # Discord event handlers
│   └── interactionCreate.js
├── handlers/          # Command/event loaders
│   └── commandHandler.js
├── .env               # Environment variables (not in repo)
├── .gitignore         # Git ignore rules
├── index.js           # Main entry point
├── package.json       # Dependencies
└── README.md          # This file
```

## 🎯 How It Works

### Queue System
1. First song plays immediately
2. Additional songs are added to queue
3. Songs auto-advance when current track finishes
4. Loop modes affect playback behavior:
   - **Track Loop**: Repeats current song indefinitely
   - **Queue Loop**: Cycles through entire queue

### SoundCloud Integration
- Automatic client ID retrieval
- Free tier streaming
- 10-song search results with button selection
- High-quality audio playback

### Command Registration
- Commands automatically register on bot startup
- Hot-reload support for development
- Slash commands visible in Discord

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | Required |
| `CLIENT_ID` | Your Discord application ID | Required |
| `MESSAGE_DELETE_TIMEOUT` | Time before messages auto-delete (ms) | 15000 |
| `VOLUME_MIN` | Minimum volume level | 0 |
| `VOLUME_MAX` | Maximum volume level | 200 |

### Web Server
The dashboard runs on port `8080` by default. Modify in `index.js`:
```javascript
const config = {
    webPort: 8080  // Change this port
};
```

## 🐛 Troubleshooting

### Bot not responding
- Check bot token is valid in `.env`
- Ensure bot has proper permissions in Discord
- Verify bot is online in Discord

### Commands not showing
- Wait 5-10 minutes for Discord to register commands globally
- Kick and re-invite bot to refresh commands
- Check console for registration errors

### Audio not playing
- Verify bot has `Connect` and `Speak` permissions
- Check SoundCloud initialization in console
- Ensure you're in a voice channel

### Port 8080 already in use
- Kill the process using port 8080:
  ```powershell
  # Windows PowerShell
  Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
  ```bash
  # Linux/Mac
  lsof -ti:8080 | xargs kill -9
  ```

## 📝 Development

### Adding New Commands

1. Create a new file in `commands/` directory:
```javascript
const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'commandname',
        description: 'Command description'
    },
    
    async execute(interaction, client) {
        await interaction.reply({
            content: 'Response message',
            flags: MessageFlags.Ephemeral
        });
    }
};
```

2. Restart the bot - commands auto-load and register

### Hot Reload
The bot supports hot-reloading of commands without restart (in development).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [play-dl](https://github.com/play-dl/play-dl) - SoundCloud integration
- [@discordjs/voice](https://github.com/discordjs/voice) - Voice connection handling
- [Express](https://expressjs.com/) - Web dashboard

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [Discord.js Documentation](https://discord.js.org/)
3. Open an issue on GitHub

## 🎉 Features Coming Soon

- YouTube support
- Spotify integration
- Playlist management
- Now playing embeds
- Search history
- Favorites system
- Multi-language support

---

**Made with ❤️ by Ofer-Aharonson**

*Star ⭐ this repository if you find it helpful!*
