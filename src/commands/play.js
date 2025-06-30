/**
 * Play command - Plays a song from YouTube in the voice channel
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection
} = require('@discordjs/voice');
const play = require('play-dl');

// Create collections to store players and queues for each guild
global.players = global.players || new Map();
global.queues = global.queues || new Map();

/**
 * Safely reply to an interaction, avoiding the "already acknowledged" error
 * @param {Object} interaction - Discord interaction object 
 * @param {string|Object} content - Content to send
 * @param {boolean} isError - Whether this is an error message
 * @returns {Promise} - Promise that resolves when reply is sent
 */
async function safeReply(interaction, content, isError = false) {
  try {
    // If content is a string, convert to object format
    const replyContent = typeof content === 'string' ? { content } : content;
    
    if (interaction.deferred || interaction.replied) {
      return await interaction.editReply(replyContent);
    } else {
      return await interaction.reply({...replyContent, ephemeral: isError});
    }
  } catch (err) {
    console.error('Error replying to interaction:', err);
    // Try to send a message to the channel if replying fails
    try {
      if (interaction.channel) {
        await interaction.channel.send(typeof content === 'string' ? content : 'There was an error processing your request.');
      }
    } catch (channelError) {
      console.error('Failed to send fallback message to channel:', channelError);
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song name to search for or YouTube URL to play')
        .setRequired(true)),
        
  async execute(interaction) {
    // Get the query option
    const query = interaction.options.getString('query');
    
    // Check if the user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return safeReply(interaction, '❌ You need to be in a voice channel to use this command!', true);
    }
    
    // Defer reply to give us time to process
    await interaction.deferReply();
    
    try {
      // Initialize the queue for this guild if it doesn't exist
      if (!global.queues.has(interaction.guildId)) {
        global.queues.set(interaction.guildId, []);
      }
      
      let videoInfo;
      
      // Check if the query is a YouTube URL
      const isYouTubeUrl = query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/);
      
      if (isYouTubeUrl) {
        // It's a valid YouTube URL, get video info directly
        console.log('Processing direct YouTube URL:', query);
        try {
          const videoDetails = await play.video_info(query);
          
          if (!videoDetails || !videoDetails.video_details || !videoDetails.video_details.url) {
            return safeReply(interaction, '❌ Could not get proper video details from this URL. Please try a different video.', true);
          }
          
          videoInfo = {
            title: videoDetails.video_details.title || 'Unknown title',
            url: videoDetails.video_details.url,
            thumbnail: videoDetails.video_details.thumbnails && videoDetails.video_details.thumbnails.length > 0 
              ? videoDetails.video_details.thumbnails[0].url : null,
            duration: videoDetails.video_details.durationRaw || 'Unknown'
          };
        } catch (error) {
          console.error('Error getting video info:', error);
          return safeReply(interaction, '❌ Could not get information for this YouTube URL. Please try a different video.', true);
        }
      } else {
        // It's a search term, search YouTube
        console.log('Searching YouTube for:', query);
        try {
          const searchResults = await play.search(query, { limit: 1 });
          
          if (!searchResults || searchResults.length === 0) {
            return safeReply(interaction, '❌ No results found for your search. Try a different query!', true);
          }
          
          const video = searchResults[0];
          
          if (!video || !video.url) {
            return safeReply(interaction, '❌ Found a video but couldn\'t get its URL. Please try a different search.', true);
          }
          
          videoInfo = {
            title: video.title || 'Unknown title',
            url: video.url,
            thumbnail: video.thumbnails && video.thumbnails.length > 0 ? video.thumbnails[0].url : null,
            duration: video.durationRaw || 'Unknown'
          };
          
          console.log('Found video:', videoInfo.title, videoInfo.url);
        } catch (searchError) {
          console.error('Search error:', searchError);
          return safeReply(interaction, '❌ Error searching for that song. Please try a different query.', true);
        }
      }
      
      // Validate videoInfo before continuing
      if (!videoInfo || !videoInfo.url) {
        return safeReply(interaction, '❌ Unable to get a valid song URL. Please try again with a different query or URL.', true);
      }
      
      // Add the song to the queue
      const queue = global.queues.get(interaction.guildId);
      queue.push(videoInfo);
      
      // Connect to voice channel if not already connected
      let connection = getVoiceConnection(interaction.guildId);
      if (!connection) {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
      }
      
      // Create a player if one doesn't exist
      if (!global.players.has(interaction.guildId)) {
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
          }
        });
        
        // Set up player events
        player.on(AudioPlayerStatus.Idle, () => {
          // Remove the current song and play the next one if available
          const guildQueue = global.queues.get(interaction.guildId);
          if (guildQueue && guildQueue.length > 0) {
            guildQueue.shift();
            
            if (guildQueue.length > 0) {
              playSong(guildQueue[0], player, interaction.guildId, interaction.channel);
            }
          }
        });
        
        player.on('error', error => {
          console.error('Player error:', error);
          interaction.channel.send('❌ There was an error playing the song!').catch(console.error);
        });
        
        global.players.set(interaction.guildId, player);
        connection.subscribe(player);
      }
      
      // If this is the first song, start playing
      if (queue.length === 1) {
        playSong(videoInfo, global.players.get(interaction.guildId), interaction.guildId, interaction.channel);
      }
      
      // Create an embed response
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(queue.length === 1 ? '🎵 Now Playing' : '🎵 Added to Queue')
        .setDescription(`**${videoInfo.title}**`)
        .setThumbnail(videoInfo.thumbnail)
        .addFields(
          { name: 'Duration', value: videoInfo.duration, inline: true },
          { name: 'Position', value: queue.length === 1 ? 'Now Playing' : `#${queue.length}`, inline: true }
        )
        .setURL(videoInfo.url);
      
      return safeReply(interaction, { embeds: [embed] });
      
    } catch (error) {
      console.error('Command error:', error);
      return safeReply(interaction, '❌ There was an error trying to play that song!', true);
    }
  },
};

/**
 * Play a song using play-dl
 * @param {Object} song - Song information object
 * @param {Object} player - Discord.js audio player
 * @param {string} guildId - Guild ID
 * @param {Object} textChannel - Text channel to send error messages to
 */
async function playSong(song, player, guildId, textChannel) {
  try {
    console.log(`Attempting to play: ${song.title} (${song.url})`);
    
    // Validate URL before attempting to stream
    if (!song.url || typeof song.url !== 'string' || !song.url.startsWith('http')) {
      throw new Error(`Invalid URL: "${song.url}"`);
    }
    
    // Get the stream using play-dl
    const { stream, type } = await play.stream(song.url, {
      discordPlayerCompatibility: true
    });
    
    // Create an audio resource
    const resource = createAudioResource(stream, {
      inputType: type,
      inlineVolume: true
    });
    
    // Set volume (optional)
    if (resource.volume) {
      resource.volume.setVolume(0.5);
    }
    
    // Play the song
    player.play(resource);
    console.log(`Now playing: ${song.title}`);
    
  } catch (error) {
    console.error('Error playing song:', error);
    
    // Skip the problematic song
    const queue = global.queues.get(guildId);
    if (queue && queue.length > 0) {
      queue.shift();
      
      if (queue.length > 0) {
        return playSong(queue[0], player, guildId, textChannel);
      }
    }
    
    // Send error message if a text channel is provided
    if (textChannel) {
      textChannel.send('❌ Error playing that song! Skipping to next in queue.').catch(console.error);
    }
  }
}

/**
 * Format seconds into MM:SS or HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
function formatDuration(seconds) {
  if (isNaN(seconds)) return 'Unknown';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}


