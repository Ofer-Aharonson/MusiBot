# MusiBot

A Discord music bot with SoundCloud support, queueing, playback controls, and user-friendly features.

## Features
- `/play <query>`: Play a song from SoundCloud by search or link
- `/skip`: Skip the current song
- `/stop`: Stop playback and clear the queue
- `/queue`: Show the current song queue
- `/pause` and `/resume`: Pause or resume playback
- `/nowplaying`: Show the currently playing song
- `/volume <1-100>`: Set playback volume
- `/seek <seconds|mm:ss>`: Seek to a timestamp in the current song (MP3 only)

## Setup
1. **Clone this repo** and install dependencies:
   ```sh
   npm install
   ```
2. **Create `token.json`** in the bot folder with your Discord bot token and clientId:
   ```json
   {
     "token": "YOUR_BOT_TOKEN",
     "clientId": "YOUR_CLIENT_ID"
   }
   ```
3. **Start the bot:**
   ```sh
   node index.js
   ```
   Or use the VS Code task "Start Music Bot".

## Notes
- The bot uses [soundcloud-downloader](https://www.npmjs.com/package/soundcloud-downloader) for SoundCloud streaming.
- Seeking is only supported for MP3 tracks.
- Volume is on a 1-100 scale.
- All commands are registered as Discord slash commands on startup.

## Requirements
- Node.js 18+
- Discord bot with the correct permissions ("Send Messages", "Connect", "Speak", "Use Slash Commands")

## Troubleshooting
- If commands are missing, restart the bot to re-register slash commands.
- If you see errors about permissions, check your bot's role in your Discord server.

## License
MIT
