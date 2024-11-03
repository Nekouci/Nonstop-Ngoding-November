const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js'); // Library discord.js
const User = require('../../models/user');
const Stock = require('../../models/stock');
const calculatePortfolioValue = require('../../utils/calculatePortfolioValue');
const formatToRupiah = require('../../utils/formatCurrency');

module.exports = {
    name: 'portfolio',
    description: 'Check your portfolio holdings and performance.',
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const userId = interaction.user.id;
            let user = await User.findOne({ userId });
            
            if (!user) {
                user = new User({ userId });
                await user.save();
            }

            const portfolioValue = await calculatePortfolioValue(user);
            
            let portfolioInfo = `**Balance:** ${formatToRupiah(user.balance)}\n\n**Portfolio:**\n`;
            
            if (user.portfolio.length === 0) {
                portfolioInfo += 'Your portfolio is empty.';
            } else {
                for (const item of user.portfolio) {
                    const stock = await Stock.findOne({ symbol: item.stockSymbol });
                    if (stock) {
                        const holdingValue = item.quantity * stock.currentPrice;
                        portfolioInfo += `• ${stock.name} (${item.stockSymbol}): ${item.quantity} shares @ ${formatToRupiah(stock.currentPrice)}\n   Total: ${formatToRupiah(holdingValue)}\n`;
                    }
                }
                portfolioInfo += `\n**Total Portfolio Value:** ${formatToRupiah(portfolioValue)}`;
            }
            
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Portfolio`)
                .setDescription(portfolioInfo)
                .setColor(0x64f0c9)
                .setTimestamp();
            return interaction.editReply({embeds: [embed]});
        } catch (error) {
            console.log(`Error in /portfolio:`);
            console.error(error);
        }
    }
};