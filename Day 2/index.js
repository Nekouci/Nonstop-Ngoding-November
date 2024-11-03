require('dotenv').config(); // Tambahkan file .env untuk menyimpan secret key dan value
const { Client, IntentsBitField } = require('discord.js'); // Library discord.js
const mongoose = require('mongoose'); // Library database (MongoDB)
const eventHandler = require('./handlers/eventHandler'); // Tambahkan file eventHandler
const cron = require('node-cron'); // Library node-cron
const updateStockPrices = require('./utils/stockPriceUpdater');
const notifyMarketChanges = require('./utils/notifyMarketChanges');
const notifyUsers = require('./utils/notifyUsers');
const Stock = require('./models/stock');

const client = new Client({
    // Kalian bisa tambahkan intents apa saja, tapi 4 ini yang penting
    intents: [
      IntentsBitField.Flags.Guilds,  
      IntentsBitField.Flags.GuildMembers,  
      IntentsBitField.Flags.GuildMessages, 
      IntentsBitField.Flags.MessageContent,  
    ],
});

// Memperbarui harga saham perusahaan setiap 5 menit
// dan memberikan pemberitahuan terhadap perubahan harga yang signifikan
cron.schedule('*/5 * * * *', async () => {
    await updateStockPrices();
    await notifyMarketChanges(client);
    await notifyUsers(client);
});

cron.schedule('0 0 * * *', async () => { // Selalu jalan setiap malam
    const stocks = await Stock.find();
    for (const stock of stocks) {
        stock.priceHistory.push({ price: stock.currentPrice });
        await stock.save();
    }
});

(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB.');
    
        eventHandler(client);
    
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();