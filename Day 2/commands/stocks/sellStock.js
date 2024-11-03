const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js'); // Library discord.js
const User = require('../../models/user');
const Stock = require('../../models/stock');
const formatToRupiah = require('../../utils/formatCurrency');

module.exports = {
    name: 'sell',
    description: 'Sell...',
    options: [
        {
            name: 'stock',
            description: 'Sell stocks from your portfolio.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'symbol',
                    description: 'The stock symbol you want to sell.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Apel Inc.', value: 'AAPL' },
                        { name: 'Amazing.com Inc.', value: 'AMZN' },
                        { name: 'Haji Slamet Corp.', value: 'ASLI' },
                        { name: 'Bonek Airlines Holdings Inc.', value: 'BAL' },
                        { name: 'BIT Karbit Inc.', value: 'BIT' },
                        { name: 'BATAK Inc.', value: 'BTK' },
                        { name: 'Esteh Companies Inc.', value: 'EST' },
                        { name: 'FUFUFAFA Resources Corp.', value: 'FF' },
                        { name: 'Alfabet Inc. Class K', value: 'GGK' },
                        { name: 'Gus Nimvunemgoro Inc.', value: 'GUN' },
                        { name: 'Homipet Aerospace Inc.', value: 'HMP' },
                        { name: 'INIDIA Corp.', value: 'INDA' },
                        { name: 'IronMan Inc.', value: 'IRM' },
                        { name: 'Jeruka Nipis Inc.', value: 'LIME' },
                        { name: 'Metamorphosis Platforms Inc.', value: 'META' },
                        { name: 'Peak Technologies Inc.', value: 'PEAK' },
                        { name: 'Rupiah Tree Inc.', value: 'RLTR' },
                        { name: 'So Bakso Corp.', value: 'SBTC' },
                        { name: 'Softboy Corp.', value: 'STBY' },
                        { name: 'Walawe Boots Alliance Inc.', value: 'WBA' },
                    ]
                },
                {
                    name: 'quantity',
                    description: 'The quantity of shares to sell.',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
            ],
        },
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'stock') {
                const stockSymbol = interaction.options.getString('symbol').toUpperCase();
                const quantity = interaction.options.getNumber('quantity');
                const userId = interaction.user.id;
                
                let embed = new EmbedBuilder()
                    .setColor(0x64f0c9)
                    .setFooter({text: `${client.user.username} - Stock Transaction System`});

                if (quantity <= 0) {
                    embed.setTitle('Transaction failed.')
                        .setDescription('Please enter a valid quantity greater than 0.')
                        .setColor(0x383a40);
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                const stock = await Stock.findOne({ symbol: stockSymbol });
                if (!stock) {
                    embed.setTitle('Transaction failed.')
                        .setDescription(`Stock with symbol ${stockSymbol} does not exist.`)
                        .setColor(0x383a40);
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                const user = await User.findOne({ userId });
                if (!user || user.portfolio.length === 0) {
                    embed.setTitle('Transaction failed.')
                        .setDescription("You don't own any stocks to sell.")
                        .setColor(0x383a40);
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                const portfolioItem = user.portfolio.find(item => item.stockSymbol === stockSymbol);
                if (!portfolioItem || portfolioItem.quantity < quantity) {
                    embed.setTitle('Transaction failed.')
                        .setDescription(`You don't have enough shares of ${stockSymbol} to sell.`)
                        .setColor(0x383a40);
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                const totalSale = stock.currentPrice * quantity;
                user.balance += totalSale;
                portfolioItem.quantity -= quantity;

                if (portfolioItem.quantity === 0) {
                    user.portfolio = user.portfolio.filter(item => item.stockSymbol !== stockSymbol);
                }

                user.transactionHistory.push({
                    type: 'sell',
                    stockSymbol,
                    quantity,
                    price: stock.currentPrice
                });

                await user.save();

                embed.setTitle('Transaction Completed.')
                    .setDescription(`You've successfully sold ${quantity} shares of ${stockSymbol} for ${formatToRupiah(totalSale)}.`);
                return interaction.editReply({embeds: [embed]});
            }
        } catch (error) {
            console.log(`Error in /sell stock:`);
            console.error(error);
        }
    }
};