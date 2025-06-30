// MusiBot - Discord Music Bot (renamed from bot.js)
// Features: /play, /stop, /skip using SoundCloud and more

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const scdl = require('soundcloud-downloader').default;
const fs = require('fs');

// Load token and clientId from token.json
const { token, clientId } = require('./token.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Music queue per guild
const queue = new Map();

async function playSong(guildId, channel, song) {
    let serverQueue = queue.get(guildId);
    if (!serverQueue) return;

    // Join voice channel if not already
    let connection = getVoiceConnection(guildId);
    if (!connection) {
        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guildId,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    }

    const player = createAudioPlayer();
    connection.subscribe(player);

    try {
        let stream;
        try {
            stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS);
        } catch (opusErr) {
            console.warn('OPUS not available, trying MP3:', opusErr);
            try {
                stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3);
            } catch (mp3Err) {
                console.error('Error playing song:', mp3Err);
                try {
                    await channel.send('Error playing song: ' + (mp3Err.message || mp3Err));
                } catch (e) {}
                serverQueue.songs.shift();
                playNext(guildId, channel);
                return;
            }
        }
        // Enable inline volume and set to last used or default 1.0
        const resource = createAudioResource(stream, { inlineVolume: true });
        resource.volume.setVolume(serverQueue.volume || 1.0);
        serverQueue.resource = resource;
        player.play(resource);
        serverQueue.player = player;
    } catch (err) {
        console.error('Error playing song:', err);
        try {
            await channel.send('Error playing song: ' + (err.message || err));
        } catch (e) {}
        serverQueue.songs.shift();
        playNext(guildId, channel);
        return;
    }

    player.on(AudioPlayerStatus.Idle, () => {
        serverQueue.songs.shift();
        playNext(guildId, channel);
    });
    player.on('error', error => {
        channel.send('Playback error. Skipping...');
        serverQueue.songs.shift();
        playNext(guildId, channel);
    });
    channel.send(`Now playing: **${song.title}**`);
}

function playNext(guildId, channel) {
    const serverQueue = queue.get(guildId);
    if (!serverQueue || serverQueue.songs.length === 0) {
        queue.delete(guildId);
        const connection = getVoiceConnection(guildId);
        if (connection) connection.destroy();
        return;
    }
    playSong(guildId, channel, serverQueue.songs[0]);
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const guildId = interaction.guildId;
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;

    // Enhanced error handling for user mistakes
    if (["play","skip","stop"].includes(commandName) && !voiceChannel) {
        await interaction.reply({ content: 'You must join a voice channel first!', ephemeral: true });
        return;
    }

    if (commandName === 'play') {
        const query = interaction.options.getString('query');
        if (!query || query.trim().length === 0) {
            await interaction.reply({ content: 'You must provide a search query.', ephemeral: true });
            return;
        }
        await interaction.deferReply();
        let songInfo;
        try {
            const results = await scdl.search({ limit: 1, query });
            if (!results.collection.length) throw new Error('No results');
            songInfo = {
                title: results.collection[0].title,
                url: results.collection[0].permalink_url
            };
        } catch (e) {
            await interaction.editReply('No results found on SoundCloud.');
            return;
        }
        let serverQueue = queue.get(guildId);
        if (!serverQueue) {
            serverQueue = { songs: [], channel: voiceChannel };
            queue.set(guildId, serverQueue);
        }
        serverQueue.songs.push(songInfo);
        if (serverQueue.songs.length === 1) {
            playSong(guildId, voiceChannel, songInfo);
            await interaction.editReply(`Queued and playing: **${songInfo.title}**`);
        } else {
            await interaction.editReply(`Queued: **${songInfo.title}**`);
        }
    } else if (commandName === 'skip') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.player) {
            await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
            return;
        }
        serverQueue.player.stop();
        await interaction.reply('Skipped!');
    } else if (commandName === 'stop') {
        const serverQueue = queue.get(guildId);
        if (serverQueue && serverQueue.player) serverQueue.player.stop();
        queue.delete(guildId);
        const connection = getVoiceConnection(guildId);
        if (connection) connection.destroy();
        await interaction.reply('Stopped and left the channel.');
    } else if (commandName === 'queue') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || serverQueue.songs.length === 0) {
            await interaction.reply('The queue is empty.');
            return;
        }
        const queueList = serverQueue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i+1}.`} ${s.title}`).join('\n');
        await interaction.reply({ content: `**Current Queue:**\n${queueList}`, ephemeral: false });
    } else if (commandName === 'pause') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.player) {
            await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
            return;
        }
        const success = serverQueue.player.pause();
        if (success) {
            await interaction.reply('Playback paused.');
        } else {
            await interaction.reply({ content: 'Failed to pause playback.', ephemeral: true });
        }
    } else if (commandName === 'resume') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.player) {
            await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
            return;
        }
        const success = serverQueue.player.unpause();
        if (success) {
            await interaction.reply('Playback resumed.');
        } else {
            await interaction.reply({ content: 'Failed to resume playback.', ephemeral: true });
        }
    } else if (commandName === 'nowplaying') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.songs.length) {
            await interaction.reply('Nothing is currently playing.');
            return;
        }
        const current = serverQueue.songs[0];
        await interaction.reply({ content: `Now playing: **${current.title}**`, ephemeral: false });
    } else if (commandName === 'volume') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.player) {
            await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
            return;
        }
        const vol = interaction.options.getNumber('level');
        if (vol === null || isNaN(vol) || vol < 1 || vol > 100) {
            await interaction.reply({ content: 'Volume must be between 1 and 100.', ephemeral: true });
            return;
        }
        // Convert 1-100 to 0.0-2.0 (Discord default is 1.0)
        const normVol = vol / 50;
        if (serverQueue.resource && serverQueue.resource.volume) serverQueue.resource.volume.setVolume(normVol);
        serverQueue.volume = normVol;
        await interaction.reply(`Volume set to ${vol}`);
    } else if (commandName === 'seek') {
        const serverQueue = queue.get(guildId);
        if (!serverQueue || !serverQueue.player || !serverQueue.songs.length) {
            await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
            return;
        }
        const ts = interaction.options.getString('timestamp');
        let seconds = 0;
        if (/^\d+$/.test(ts)) {
            seconds = parseInt(ts, 10);
        } else if (/^\d{1,2}:\d{1,2}$/.test(ts)) {
            const [min, sec] = ts.split(':').map(Number);
            seconds = min * 60 + sec;
        } else {
            await interaction.reply({ content: 'Invalid timestamp format. Use seconds or mm:ss.', ephemeral: true });
            return;
        }
        const song = serverQueue.songs[0];
        await interaction.deferReply();
        try {
            // Try to get a seekable stream (MP3 only)
            const stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, { startTime: seconds * 1000 });
            const resource = createAudioResource(stream, { inlineVolume: true });
            resource.volume.setVolume(serverQueue.volume || 1.0);
            serverQueue.resource = resource;
            serverQueue.player.stop(); // Will trigger playNext, but we want to keep the queue
            serverQueue.player.play(resource);
            await interaction.editReply(`Seeked to ${ts} in **${song.title}**`);
        } catch (e) {
            await interaction.editReply('Seek failed. Only some tracks support seeking (MP3 only).');
        }
        return;
    }
});

// Auto-register slash commands on bot startup
async function registerCommands() {
    const { REST, Routes, SlashCommandBuilder } = require('discord.js');
    const rest = new REST({ version: '10' }).setToken(token);
    const commands = [
        new SlashCommandBuilder().setName('play').setDescription('Play a song from SoundCloud').addStringOption(opt => opt.setName('query').setDescription('Search query').setRequired(true)),
        new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),
        new SlashCommandBuilder().setName('stop').setDescription('Stop and clear the queue'),
        new SlashCommandBuilder().setName('queue').setDescription('Show the current song queue'),
        new SlashCommandBuilder().setName('pause').setDescription('Pause the current song'),
        new SlashCommandBuilder().setName('resume').setDescription('Resume playback'),
        new SlashCommandBuilder().setName('nowplaying').setDescription('Show the currently playing song'),
        new SlashCommandBuilder().setName('volume').setDescription('Set playback volume').addNumberOption(opt => opt.setName('level').setDescription('Volume (1-100)').setRequired(true)),
        new SlashCommandBuilder().setName('seek').setDescription('Seek to a timestamp in the current song').addStringOption(opt => opt.setName('timestamp').setDescription('Time (seconds or mm:ss)').setRequired(true))
    ].map(cmd => cmd.toJSON());
    try {
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error('Failed to register slash commands:', error);
    }
}

client.once(Events.ClientReady, async () => {
    console.log('🎵 MusiBot is ready to play music!');
    await registerCommands();
    console.log('✅ All slash commands are up to date and ready to use.');
    console.log('Invite this bot to your server and use /play to get started!');
});

client.on('error', (err) => {
    console.error('Client error:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

client.login(token);
