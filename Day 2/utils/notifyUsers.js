const {Client, Interaction, EmbedBuilder} = require('discord.js'); // Library discord.js
const User = require('../models/user');

async function notifyUsers(event, client) {
    try {
        // Validasi data event
        if (!event || !event.stockSymbol) return;

        const users = await User.find({ 'holdings.symbol': event.stockSymbol });
        
        if (users.length === 0) return;

        for (const user of users) {
            try {
                const discordUser = await client.users.fetch(user.userId);

                const embed = new EmbedBuilder()
                    .setTitle(`📈 Market Update for ${event.stockSymbol}`)
                    .setDescription(
                        `${event.description}\n\n` +
                        `Impact: ${event.impact > 0 ? '📈' : '📉'} ${(event.impact * 100).toFixed(1)}% on stock price.\n\n` +
                        `💡 Check your portfolio to see how this affects you!`
                    )
                    .setColor(event.impact > 0 ? 0x00FF00 : 0xFF0000)
                    .setFooter({text: `${client.user.username} - Stock Market Notifier`})
                    .setTimestamp(new Date());

                await discordUser.send({embeds: [embed]})
                    .catch(error => console.error(`Failed to send notification to user ${user.userId}:`, error));
                
            } catch (error) {
                console.error(`Error notifying user ${user.userId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in notifyUsers:', error);
    }
}

module.exports = notifyUsers;