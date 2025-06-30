# MusiBot - Discord Music Bot

MusiBot is a Discord bot that allows users to play music from YouTube in voice channels using simple slash commands.

## Features

- 🎵 Play music from YouTube via search queries
- 🔍 Automatically searches and plays the first matching result
- 🐳 Containerized for easy deployment
- 🚀 Built with modern Discord.js v14 and slash commands

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Discord Bot Token](https://discord.com/developers/applications)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Setup

1. Clone the repository
```bash
git clone [your-repository-url]
cd MusiBot
```

2. Make sure you have a `token.json` file with your Discord bot token and client ID:
```json
{
    "token": "YOUR_DISCORD_BOT_TOKEN",
    "clientId": "YOUR_CLIENT_ID"
}
```

3. Run the bot on Windows simply by double-clicking:
```
run.bat
```

Alternatively, install manually and start:
```bash
npm install
npm start
```

## Docker Deployment

Build the Docker image:
```bash
docker build -t musibot .
```

Run the container:
```bash
docker run -d --name musibot musibot
```

## Available Commands

- `/play <query>` - Search YouTube and play the first result
- `/help` - Display available commands

## Future Features

- Queue management
- Volume control
- Skip, pause, and resume functionality
- Playlist support

## License

MIT

## Disclaimer

This bot is for educational purposes. Please respect YouTube's terms of service.
