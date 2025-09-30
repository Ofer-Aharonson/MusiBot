// Application constants
module.exports = {
    // Timeout before auto-deleting bot messages (in milliseconds)
    MESSAGE_DELETE_TIMEOUT: parseInt(process.env.MESSAGE_DELETE_TIMEOUT) || 15000,
    
    // Volume settings
    VOLUME_MIN: parseInt(process.env.VOLUME_MIN) || 0,
    VOLUME_MAX: parseInt(process.env.VOLUME_MAX) || 200,
    
    // Player settings
    LEAVE_ON_EMPTY: process.env.LEAVE_ON_EMPTY === 'true',
    
    // Error messages
    ERRORS: {
        NO_VOICE_CHANNEL: 'You are not in a voice channel!',
        NO_SONG_PLAYING: '**No song is being played!**',
        PLAYLIST_LOAD_FAILED: '**Error:** Could not load playlist!',
        SONG_LOAD_FAILED: '**Error:** Could not play song!',
        VOLUME_OUT_OF_RANGE: (min, max) => `**Volume must be between ${min} and ${max}!**`,
        SEEK_NEGATIVE: '**Seek time must be positive!**',
        INVALID_SONG_NUMBER: (length) => `**Invalid song number! Queue has ${length} songs.**`,
    },
    
    // Success messages
    MESSAGES: {
        PLAYING_PLAYLIST: (url) => `**Playing the playlist:** ${url}`,
        PLAYING_SONG: (url) => `**Playing the song:** ${url}`,
        SKIPPING: (song) => `**Skipping the song:** ${song}`,
        STOPPED: '**Stopped the player!**',
        ENDED: '**Ended the player!**',
        VOLUME_SET: (volume) => `**Set the volume to:** ${volume}`,
        LOOP_STOPPED: '**Stopped the looping song!**',
        LOOP_SONG: '**Looping current song!**',
        LOOP_QUEUE: '**Looping entire queue!**',
        SEEKING: (seconds) => `**Seeking to:** ${seconds} seconds`,
        QUEUE_CLEARED: '**Clearing the queue!**',
        QUEUE_SHUFFLED: "**Everybody's shuffling... the queue.**",
        PAUSED: '**Pausing Current song!**',
        RESUMED: '**Unpausing Current song!**',
        REMOVED: (number) => `**Removing song number:** ${number} **from the list!**`,
    }
};
