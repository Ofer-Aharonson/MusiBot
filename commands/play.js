const { ApplicationCommandOptionType } = require('discord.js');
const { ERRORS, MESSAGES } = require('../config/constants');
const { sendTemporaryReply } = require('../utils/queueHelper');
const logger = require('../utils/logger');

module.exports = {
    data: {
        name: 'play',
        description: 'Plays a song from YouTube',
        options: [
            {
                name: 'query',
                type: ApplicationCommandOptionType.String,
                description: 'The song you want to play',
                required: true
            }
        ]
    },
    
    async execute(interaction, client) {
        await interaction.deferReply();
        
        try {
            // Create or get existing queue for this guild
            const queue = client.player.createQueue(interaction.guild);
            const guildQueue = client.player.getQueue(interaction.guild);
            
            // Join the user's voice channel
            await queue.join(interaction.member.voice.channel);
            
            // Get the song/playlist URL or search query from user input
            const query = interaction.options.get('query').value;
            
            // Check if user is requesting a playlist
            if (query.includes('playlist')) {
                const song = await this.handlePlaylist(queue, guildQueue, query, interaction);
                if (!song) return;
                
                await sendTemporaryReply(interaction, MESSAGES.PLAYING_PLAYLIST(song.url));
            } else {
                const song = await this.handleSong(queue, guildQueue, query, interaction);
                if (!song) return;
                
                await sendTemporaryReply(interaction, MESSAGES.PLAYING_SONG(song.url));
            }
        } catch (error) {
            logger.error('Error in play command:', error);
            await sendTemporaryReply(interaction, `**Error:** ${error.message}`);
        }
    },
    
    async handlePlaylist(queue, guildQueue, query, interaction) {
        const song = await queue.playlist(query).catch(err => {
            logger.error('Playlist load error:', err);
            if (!guildQueue) queue.stop();
            return null;
        });
        
        if (!song) {
            await sendTemporaryReply(interaction, ERRORS.PLAYLIST_LOAD_FAILED);
            return null;
        }
        
        return song;
    },
    
    async handleSong(queue, guildQueue, query, interaction) {
        const song = await queue.play(query).catch(err => {
            logger.error('Song load error:', err);
            if (!guildQueue) queue.stop();
            return null;
        });
        
        if (!song) {
            await sendTemporaryReply(interaction, ERRORS.SONG_LOAD_FAILED);
            return null;
        }
        
        return song;
    }
};
