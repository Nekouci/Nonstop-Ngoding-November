const {Client, EmbedBuilder} = require('discord.js'); // Library discord.js
const Stock = require('../models/stock');
const formatToRupiah = require('./formatCurrency');

async function notifyMarketChanges(client) {
    try {
        const stocks = await Stock.find();
        const announcementsChannel = client.channels.cache.get(''); // Kalian bisa isi ID Channel yang diinginkan sebagai announcement

        // Memverifikasi jika channel Discordnya ada
        if (!announcementsChannel) {
            console.error('Announcements channel not found!');
            return;
        }

        for (const stock of stocks) {
            const changePercent = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
            
            if (Math.abs(changePercent) >= 10) {
                const embed = new EmbedBuilder()
                    .setTitle(`🚨 Market Alert: ${stock.symbol}`)
                    .setDescription(
                        `**${stock.name}** has had a significant price change.\n` +
                        `Previous Close: ${formatToRupiah(stock.previousClose)}`
                    )
                    .addFields([
                        {
                            name: 'Current Price',
                            value: formatToRupiah(stock.currentPrice),
                            inline: true
                        },
                        {
                            name: 'Change',
                            value: `${changePercent > 0 ? '📈' : '📉'} ${changePercent.toFixed(2)}%`,
                            inline: true
                        }
                    ])
                    .setColor(changePercent > 0 ? 0x00FF00 : 0xFF0000)
                    .setTimestamp()
                    .setFooter({text: `${client.user.username} - Market Alert System`});

                await announcementsChannel.send({ embeds: [embed] })
                    .catch(error => console.error(`Failed to send alert for ${stock.symbol}:`, error));
            }
        }
    } catch (error) {
        console.error(`Error in notifyMarketChanges:`);
        console.error(error);
    }
}

module.exports = notifyMarketChanges;