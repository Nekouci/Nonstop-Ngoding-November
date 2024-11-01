const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const VirtualPet = require('../../models/VirtualPets');

module.exports = {
    name: 'pet',
    description: 'Check...',
    options: [
        {
            name: 'status',
            description: 'Check the current status of your pet.',
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
    
            if (subcommand === 'status') {
                const userId = interaction.user.id;

                const pet = await VirtualPet.findOne({ userId });

                if (!pet) {
                    const embed = new EmbedBuilder()
                        .setDescription("You don't have a pet yet. Use `/adopt pet` to adopt one.")
                        .setColor(0x383a40)
                        .setTimestamp(new Date());
                    return interaction.editReply({embeds: [embed]});
                }

                const statusEmbed = {
                    color: 0x64f0c9,
                    title: `${interaction.user.username} Pet's Status`,
                    description: `Here is the current status of your pet, ${pet.petEmoji} **${pet.petName}**.`,
                    fields: [
                    { name: 'Happiness', value: `${pet.happiness} / 100`, inline: true },
                    { name: 'Hunger', value: `${pet.hunger} / 100`, inline: true },
                    { name: 'Energy', value: `${pet.energy} / 100`, inline: true },
                    { name: 'Level', value: `${pet.level} (${pet.experience} / ${pet.levelUpThreshold} XP)`, inline: true },
                    { name: 'Evolution Stage', value: `${pet.evolutionStage}`, inline: true },
                    ],
                    footer: {
                    text: 'Keep interacting with your pet to keep it happy and healthy!',
                    },
                };

                interaction.editReply({ embeds: [statusEmbed] });
            }
        } catch (error) {
            console.log(`Error with /pet status:`);
            console.error(error);
        }
    }
};