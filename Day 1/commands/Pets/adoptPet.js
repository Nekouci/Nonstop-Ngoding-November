const {Client, Interaction, ApplicationCommandOptionType} = require('discord.js'); // Library discord.js
const VirtualPet = require('../../models/VirtualPets');

const petTypes = {
    bird: '🐦',
    dog: '🐶',
    turtle: '🐢',
    cat: '🐱',
    guineaPig: '🐹',
    fish: '🐟',
    hamster: '🐹',
    rabbit: '🐰',
};

module.exports = {
    name: 'adopt',
    description: 'Adopt...',
    options: [
        {
            name: 'pet',
            description: 'Adopt a new pet with custom name.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'Name for your new pet.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'type',
                    description: 'The pet type that you want.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: `${petTypes.bird} Bird`, value: 'bird' },
                        { name: `${petTypes.dog} Dog`, value: 'dog' },
                        { name: `${petTypes.turtle} Turtle`, value: 'turtle' },
                        { name: `${petTypes.cat} Cat`, value: 'cat' },
                        { name: `${petTypes.guineaPig} Guinea Pig`, value: 'guineaPig' },
                        { name: `${petTypes.fish} Fish`, value: 'fish' },
                        { name: `${petTypes.hamster} Hamster`, value: 'hamster' },
                        { name: `${petTypes.rabbit} Rabbit`, value: 'rabbit' },
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

            const petName = interaction.options.getString('name');
            const petType = interaction.options.getString('type');

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'pet') {
                const existingPet = await VirtualPet.findOne({ userId: interaction.user.id });

                if (existingPet) {
                    return interaction.editReply(`You already have a pet named **${existingPet.petName}**!`);
                }

                const petEmoji = petTypes[petType];

                const newPet = new VirtualPet({
                    userId: interaction.user.id,
                    petName: petName,
                    petType: petType,
                    petEmoji: petEmoji,
                    happiness: 100,
                    hunger: 100,
                    energy: 100,
                    level: 1,
                    evolutionStage: 1,
                });

                await newPet.save();

                interaction.editReply(`Congratulations! You've adopted a ${petEmoji} ${petType} named **${petName}**!`);
            }
        } catch (error) {
            console.log(`Error with /adopt pet:`);
            console.error(error);
        }
    }
};