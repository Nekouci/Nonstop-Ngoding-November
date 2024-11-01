const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const VirtualPet = require('../../models/VirtualPets');
const addExperience = require('../../utils/givePetXP');
const rewardUser = require('../../utils/petReward');

module.exports = {
    name: 'feed',
    description: 'Feed...',
    options: [
        {
            name: 'pet',
            description: 'Feed your pet.',
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

            if (interaction.options.getSubcommand() === 'pet') {
                const userId = interaction.user.id;
                const hungerIncrease = 20;
                const maxHunger = 100;
                const pet = await VirtualPet.findOne({ userId });
    
                const embed = new EmbedBuilder()
                    .setColor(0x64f0c9)
                    .setTimestamp(new Date());

                if (!pet) {
                    embed.setDescription("You don't have a pet yet. Use `/adopt pet` to adopt one.")
                        .setColor(0x383a40);
                    return interaction.editReply({embeds: [embed]});
                }

                if (pet.hunger >= 100) {
                    embed.setDescription(`Your pet is already full!\n${pet.petEmoji} **${pet.petName} hunger: ${pet.hunger}/100.**`);
                    return interaction.editReply({embeds: [embed]});
                }
    
                pet.hunger = Math.min(pet.hunger + hungerIncrease, maxHunger); // Memastikan hunger tidak melebihi batas maksimum
                await pet.save();
                const xpResult = await addExperience(pet);
                const rewardResult = await rewardUser(pet, 'feed');

                let resultMessage = `You fed your pet!\n${pet.petEmoji} **${pet.petName} hunger: ${pet.hunger}/100.**`;
                
                embed.setDescription(resultMessage);
                interaction.editReply({embeds: [embed]});
            }
        } catch (error) {
            console.log(`Error with /feed pet:`);
            console.error(error);
        }
    }
};