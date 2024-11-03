const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js'); // Library discord.js
const User = require('../../models/user');
const calculatePortfolioValue = require('../../utils/calculatePortfolioValue');
const formatToRupiah = require('../../utils/formatCurrency');

module.exports = {
    name: 'leaderboard',
    description: 'Display...',
    options: [
        {
            name: 'portfolio',
            description: 'Display the top users by portfolio value.',
            type: ApplicationCommandOptionType.Subcommand,
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

            if (subcommand === 'portfolio') {
                const users = await User.find();

                const embed = new EmbedBuilder()
                    .setTitle('Top Investors')
                    .setColor(0x64f0c9)
                    .setFooter({text: `${client.user.username} - Stock Market Information`});
                    
                const leaderboardData = await Promise.all(
                    users.map(async user => {
                        const portfolioValue = await calculatePortfolioValue(user);
                        return { 
                            userId: user.userId, 
                            portfolioValue,
                            username: (await interaction.client.users.fetch(user.userId)).username
                        };
                    })
                );
        
                const sortedLeaderboard = leaderboardData.sort((a, b) => b.portfolioValue - a.portfolioValue).slice(0, 10);
                
                const leaderboardMessage = sortedLeaderboard.map((entry, index) => {
                    const user = interaction.client.users.cache.get(entry.userId);
                    return `${index + 1}. ${user ? user.tag : 'User Not Found'}: ${formatToRupiah(entry.portfolioValue)}`;
                }).join('\n');
        
                embed.setDescription(leaderboardMessage);
                return interaction.editReply({embeds: [embed]});
            }
        } catch (error) {
            console.log(`Error in /leaderboard portfolio:`);
            console.error(error);
        }
    }
};