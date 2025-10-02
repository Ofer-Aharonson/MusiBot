// Play Command - SoundCloud search with button selection
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

// Store pending song selections (userId -> search results)
const pendingSelections = new Map();

module.exports = {
    data: {
        name: 'play',
        description: 'Search and play music from SoundCloud',
        options: [{
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Song name or artist',
            required: true
        }]
    },
    
    async execute(interaction, client) {
        try {
            const query = interaction.options.getString('query');
            
            // Reply immediately to prevent timeout
            await interaction.reply({ 
                content: '🔍 Searching SoundCloud...', 
                flags: MessageFlags.Ephemeral
            });
            
            // Search SoundCloud
            const searchResults = await play.search(query, {
                source: { soundcloud: 'tracks' },
                limit: 10
            });
            
            if (!searchResults || searchResults.length === 0) {
                return await interaction.editReply({ 
                    content: '❌ No SoundCloud results found!', 
                    components: [] 
                });
            }
            
            // Create buttons for top 10 results
            const row1 = new ActionRowBuilder();
            const row2 = new ActionRowBuilder();
            
            searchResults.slice(0, 10).forEach((track, index) => {
                const title = track.title || track.name || 'Unknown Track';
                const button = new ButtonBuilder()
                    .setCustomId('play_' + interaction.user.id + '_' + index)
                    .setLabel((index + 1) + '. ' + title.substring(0, 40))
                    .setStyle(ButtonStyle.Primary);
                
                if (index < 5) {
                    row1.addComponents(button);
                } else {
                    row2.addComponents(button);
                }
            });
            
            // Store search results
            pendingSelections.set(interaction.user.id, {
                tracks: searchResults.slice(0, 10),
                timestamp: Date.now()
            });
            
            // Show selection menu
            const components = row2.components.length > 0 ? [row1, row2] : [row1];
            await interaction.editReply({
                content: '🎵 **Pick a SoundCloud track:**',
                components: components
            });
            
            // Cleanup after 15 minutes
            setTimeout(() => {
                pendingSelections.delete(interaction.user.id);
            }, 900000);
            
        } catch (error) {
            console.error('Play command error:', error);
            await interaction.editReply({ 
                content: 'Error: ' + error.message, 
                components: [] 
            });
        }
    },
    
    async handleButtonInteraction(interaction, client) {
        try {
            const parts = interaction.customId.split('_');
            const userId = parts[1];
            const index = parseInt(parts[2]);
            
            // Verify user owns this search
            if (interaction.user.id !== userId) {
                return await interaction.reply({
                    content: '❌ Not your search!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            // Get selection
            const selection = pendingSelections.get(userId);
            if (!selection) {
                return await interaction.reply({
                    content: '❌ Search expired!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            const track = selection.tracks[index];
            await interaction.deferUpdate();
            
            // Get voice channel
            const member = await interaction.guild.members.fetch(userId);
            if (!member.voice.channel) {
                return await interaction.followUp({
                    content: '❌ Join a voice channel first!',
                    flags: MessageFlags.Ephemeral
                });
            }
            
            const logTitle = track.title || track.name || 'Unknown Track';
            console.log('Playing: ' + logTitle + ' (' + track.url + ')');
            
            // Get or create queue
            let queue = client.stats.queues.get(interaction.guild.id);
            if (!queue) {
                queue = {
                    tracks: [],
                    loop: false,
                    queueLoop: false,
                    currentTrack: null
                };
                client.stats.queues.set(interaction.guild.id, queue);
            }
            
            // Get or create voice connection
            let guildData = client.stats.voiceConnections.get(interaction.guild.id);
            
            if (!guildData) {
                // Create connection
                const connection = joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                
                const player = createAudioPlayer();
                connection.subscribe(player);
                
                guildData = {
                    connection,
                    player,
                    guildName: interaction.guild.name,
                    channelName: member.voice.channel.name,
                    connectedAt: Date.now(),
                    volume: 1.0
                };
                
                client.stats.voiceConnections.set(interaction.guild.id, guildData);
                
                // Handle track finished - play next in queue
                player.on(AudioPlayerStatus.Idle, async () => {
                    console.log('Track finished');
                    const q = client.stats.queues.get(interaction.guild.id);
                    if (!q) return;
                    
                    // Handle loop modes
                    if (q.loop && q.currentTrack) {
                        // Replay current track
                        const stream = await play.stream(q.currentTrack.url);
                        const resource = createAudioResource(stream.stream, {
                            inputType: stream.type
                        });
                        guildData.player.play(resource);
                        return;
                    }
                    
                    // Play next track
                    if (q.tracks.length > 0) {
                        const nextTrack = q.tracks.shift();
                        q.currentTrack = nextTrack;
                        
                        // If queue loop, add current track back to end
                        if (q.queueLoop) {
                            q.tracks.push(nextTrack);
                        }
                        
                        const stream = await play.stream(nextTrack.url);
                        const resource = createAudioResource(stream.stream, {
                            inputType: stream.type
                        });
                        guildData.player.play(resource);
                        console.log('Playing next: ' + (nextTrack.title || 'Unknown'));
                    }
                });
            }
            
            // Check if currently playing
            const isPlaying = guildData.player.state.status === AudioPlayerStatus.Playing;
            
            if (isPlaying) {
                // Add to queue
                queue.tracks.push(track);
                const displayTitle = track.title || track.name || 'Unknown Track';
                await interaction.editReply({
                    content: `➕ Added to queue (Position ${queue.tracks.length}): **${displayTitle}**`,
                    components: []
                });
            } else {
                // Play immediately
                queue.currentTrack = track;
                const stream = await play.stream(track.url);
                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });
                
                guildData.currentResource = resource;
                guildData.currentTrack = track;
                guildData.player.play(resource);
                
                const displayTitle = track.title || track.name || 'Unknown Track';
                await interaction.editReply({
                    content: '▶️ Now playing: **' + displayTitle + '**',
                    components: []
                });
            }
            
            pendingSelections.delete(userId);
            
        } catch (error) {
            console.error('Button interaction error:', error);
            await interaction.followUp({
                content: 'Error: ' + error.message,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
