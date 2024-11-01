const {
    Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, ApplicationCommandOptionType
} = require('discord.js');
const VirtualPet = require('../../models/VirtualPets');
const addExperience = require('../../utils/givePetXP');
const rewardUser = require('../../utils/petReward');

module.exports = {
    name: 'play',
    description: 'Play...',
    options: [
        {
            name: 'pet',
            description: 'Play with your pet.',
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
                const happinessIncrease = 15;
                const energyDecrease = 10;
                const maxHappiness = 100;
                const minEnergy = 0;
                const pet = await VirtualPet.findOne({ userId });

                const embed = new EmbedBuilder()
                    .setColor(0x64f0c9)
                    .setTimestamp(new Date());

                if (!pet) {
                    embed.setDescription("You don't have a pet yet. Use `/adopt pet` to adopt one.")
                        .setColor(0x383a40);
                    return interaction.editReply({embeds: [embed]});
                }

                if (pet.energy <= 0) {
                    embed.setDescription(`Your pet is too tired to play right now. Let them rest a bit.\n${pet.petEmoji} **${pet.petName} energy: ${pet.energy}/100.**`)
                        .setColor(0x383a40);
                    return interaction.editReply({embeds: [embed]});
                }

                pet.happiness = Math.min(pet.happiness + happinessIncrease, maxHappiness);
                pet.energy = Math.max(pet.energy - energyDecrease, minEnergy);
                await pet.save();
                
                const xpResult = await addExperience(pet);
                const rewardResult = await rewardUser(pet, 'play');
                
                let resultMessage = `You played with your pet!\n${pet.petEmoji} **${pet.petName} happiness: ${pet.happiness}/100.**\n${pet.petEmoji} **${pet.petName} energy: ${pet.energy}/100.**`;
                
                if (rewardResult) resultMessage += `\n${rewardResult}`;
                if (xpResult && xpResult.leveledUp) {
                    resultMessage += `\nYour pet leveled up to **level ${xpResult.newLevel}**!`;
                    if (xpResult.newEvolution) {
                        resultMessage += `\nYour pet evolved into **${xpResult.newEvolution}**! ${pet.petEmoji}`;
                    }
                }

                embed.setDescription(resultMessage);
                interaction.editReply({embeds: [embed]});
            }
        } catch (error) {
            console.log(`Error with /play pet:`);
            console.error(error);
        }
    }
};