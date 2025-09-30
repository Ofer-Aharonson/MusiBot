// Load environment variables
require('dotenv').config();

module.exports = {
    // Discord credentials
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    
    // Import constants
    ...require('./constants')
};
