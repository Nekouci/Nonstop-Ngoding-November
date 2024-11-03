require('dotenv').config(); // Tambahkan file .env untuk menyimpan secret key dan value
const { Client, IntentsBitField } = require('discord.js'); // Library discord.js
const eventHandler = require('./handlers/eventHandler'); // Tambahkan file eventHandler
const {response1, response2, response3, getRandomResponse} = require('./utils/messageResponse');

const client = new Client({
    // Kalian bisa tambahkan intents apa saja, tapi 4 ini yang penting
    intents: [
      IntentsBitField.Flags.Guilds,  
      IntentsBitField.Flags.GuildMembers,  
      IntentsBitField.Flags.GuildMessages, 
      IntentsBitField.Flags.MessageContent,  
    ],
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
  
    const botMention = `<@${client.user.id}>`;
    const userMessage = message.content.toLowerCase();
  
    let response;

    // Contoh dialog yang ingin dibalas oleh bot
    if (message.content.startsWith(botMention) || userMessage.startsWith('evelyn')) {
        if (userMessage.includes('ask')) {
            response = getRandomResponse(response2);
        } else if (userMessage.includes('help')) {
            response = getRandomResponse(response3);
        } else {
            response = getRandomResponse(response1);
        }
    
        await message.reply(response);
    }
});

(async () => {
    try {
        eventHandler(client);
    
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();