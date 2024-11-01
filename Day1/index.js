require('dotenv').config(); // Tambahkan file .env untuk menyimpan secret key dan value
const { Client, IntentsBitField } = require('discord.js'); // Library discord.js
const mongoose = require('mongoose'); // Library database (MongoDB)
const eventHandler = require('./handlers/eventHandler'); // Tambahkan file eventHandler
const cron = require('node-cron'); // Library node-cron
const { initializeDecaySystem } = require('./utils/petDecaySystem');
const { recoveryEnergy } = require('./utils/petEnergyRecovery');

const client = new Client({
    // Kalian bisa tambahkan intents apa saja, tapi 4 ini yang penting
    intents: [
        IntentsBitField.Flags.Guilds,  
        IntentsBitField.Flags.GuildMembers,  
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,  
    ],
});

client.once('ready', async () => {
    try {
        initializeDecaySystem(client);
    } catch (error) {
        console.error('Error initializing decay system:', error);
    }
});

// Energy recovery function berjalan setiap 15 menit
cron.schedule('*/15 * * * *', recoveryEnergy);

(async () => {
    try {
        // Login ke database
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');
      
        // Boot-up eventHandler
        eventHandler(client);
      
        // Login client bot ke Discord
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();