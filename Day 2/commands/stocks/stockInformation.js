const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js'); // Library discord.js
const Stock = require('../../models/stock');
const formatToRupiah = require('../../utils/formatCurrency');

module.exports = {
    name: 'stock',
    description: 'View...',
    options: [
        {
            name: 'list',
            description: 'View all available stocks in the market',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'sector',
                    description: 'Filter stocks by sector',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Technology', value: 'Technology' },
                        { name: 'Transportation', value: 'Transportation' },
                        { name: 'Finance', value: 'Finance' },
                        { name: 'Consumer Goods', value: 'Consumer Goods' },
                        { name: 'Resources', value: 'Resources' },
                        { name: 'Healthcare', value: 'Healthcare' },
                        { name: 'All Sectors', value: 'all' }
                    ],
                },
            ],
        },
        {
            name: 'history',
            description: 'View historical prices of a stock.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'symbol',
                    description: 'The stock symbol.',
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
                    ],
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

            if (subcommand === 'list') {
                const sector = interaction.options.getString('sector');
                
                // Kueri saham berdasarkan filter sektor
                const query = sector !== 'all' ? { sector } : {};
                const stocks = await Stock.find(query).sort({ symbol: 1 });
    
                if (!stocks || stocks.length === 0) {
                    return await interaction.editReply({
                        content: 'No stocks found in the database.',
                        ephemeral: true
                    });
                }
    
                const embed = new EmbedBuilder()
                    .setTitle('📊 Stock Market Listings')
                    .setColor(0x64f0c9)
                    .setTimestamp()
                    .setFooter({ 
                        text: `${client.user.username} - Stock Market Information`
                    });
    
                if (sector !== 'all') {
                    // Tampilan sektor tunggal
                    const stockList = stocks.map(stock => {
                        const priceChange = ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100).toFixed(2);
                        const changeEmoji = priceChange > 0 ? '📈' : priceChange < 0 ? '📉' : '➖';
                        return `${changeEmoji} **${stock.symbol}** - ${stock.name}\n└ ${formatToRupiah(stock.currentPrice)} (${priceChange}%)`;
                    }).join('\n\n');

                    if (stockList) {
                        embed.addFields({
                            name: `${sector} Sector`,
                            value: stockList || 'No stocks available',
                            inline: false
                        });
                    }
                } else {
                    // Tampilan semua sektor
                    const stocksBySector = stocks.reduce((acc, stock) => {
                        const sect = stock.sector || 'Miscellaneous';
                        if (!acc[sect]) acc[sect] = [];
                        acc[sect].push(stock);
                        return acc;
                    }, {});
    
                    Object.entries(stocksBySector).forEach(([sectorName, sectorStocks]) => {
                        const stockList = sectorStocks.map(stock => {
                            const priceChange = ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100).toFixed(2);
                            const changeEmoji = priceChange > 0 ? '📈' : priceChange < 0 ? '📉' : '➖';
                            return `${changeEmoji} **${stock.symbol}** - ${stock.name}\n└ ${formatToRupiah(stock.currentPrice)} (${priceChange}%)`;
                        }).join('\n\n');
    
                        if (stockList) {
                            embed.addFields({
                                name: `${sectorName} Sector`,
                                value: stockList,
                                inline: false
                            });
                        }
                    });
                }
    
                // Menambahkan informasi kecil mengenai ringkasan pasar
                const totalStocks = stocks.length;
                const gainers = stocks.filter(s => s.currentPrice > s.previousClose).length;
                const losers = stocks.filter(s => s.currentPrice < s.previousClose).length;
    
                embed.setDescription(
                    `**Market Summary**\n` +
                    `Total Stocks: ${totalStocks}\n` +
                    `Gains: ${gainers} 📈 | Losses: ${losers} 📉\n` +
                    `Unchanged: ${totalStocks - gainers - losers} ➖\n\n` +
                    `📈 Rising | 📉 Falling | ➖ Unchanged`
                );
    
                await interaction.editReply({ embeds: [embed] });
            }
    
            if (subcommand === 'history') {
                const symbol = interaction.options.getString('symbol').toUpperCase();
                const stock = await Stock.findOne({ symbol });
    
                let embed = new EmbedBuilder()
                    .setTitle('Stock History')
                    .setColor(0x64f0c9)
                    .setFooter({text: `${client.user.username} - Stock Market Information`})
                    .setTimestamp(new Date());
    
                if (!stock || stock.priceHistory.length === 0) {
                    embed.setDescription(`No historical data found for **${symbol}**.`);
                    return interaction.editReply({embeds: [embed]});
                }
    
                const history = [...stock.priceHistory]
                    .slice(-10)  // Hanya menampilkan 10 entri terbaru tentang histori harga saham
                    .reverse()   // Menyortir entri menjadi yang terbaru terlebih dahulu
                    .map(entry => {
                        const date = new Date(entry.date);
                        const formattedDateTime = date.toLocaleString('en-EN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'Asia/Jakarta'
                        });
                        return `**${formattedDateTime}** : ${formatToRupiah(entry.price)}`;
                    })
                    .join('\n');
    
                embed.setDescription(`**Price History for ${stock.name} (${symbol})**\n\n${history}`);
                interaction.editReply({embeds: [embed]});
            } 
        } catch (error) {
            console.log(`Error in stockInformation.js:`);
            console.error(error);
        }
    }
};