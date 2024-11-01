const VirtualPet = require('../models/VirtualPets');
const cron = require('node-cron');

function getRandomDecay(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DECAY_INTERVAL = 3600000; // 1 jam dalam milisekon
const DECAY_CHECK_INTERVAL = 3600000; // Mengecek tiap jam

async function applyDecay(client) {
    try {
        const pets = await VirtualPet.find({});

        for (let pet of pets) {
            // Mengecek waktu interaksi terakhir
            const timeSinceLastInteraction = Date.now() - pet.lastInteraction;
            if (timeSinceLastInteraction < DECAY_INTERVAL) continue;

            const DECAY_AMOUNT = {
                hunger: getRandomDecay(5, 10),
                happiness: getRandomDecay(1, 5),
            };
            
            pet.hunger = Math.max(pet.hunger - DECAY_AMOUNT.hunger, 0);
            pet.happiness = Math.max(pet.happiness - DECAY_AMOUNT.happiness, 0);
            
            // Memberitahukan user tentang hewannya dalam status kritis
            try {
                if (pet.hunger <= 20 || pet.happiness <= 20) {
                    const user = await client.users.fetch(pet.userId);
                    await user.send(`Your pet ${pet.petEmoji}${pet.petName} needs attention! ${
                        pet.hunger <= 20 ? 'They are hungry!' : 'They are unhappy!'
                    }`);
                }
            } catch (err) {
                console.log(`Could not notify user ${pet.userId}: ${err.message}`);
            }
            
            await pet.save();
        }
    } catch (error) {
        console.log(`Error applying pet decay:`, error);
    }
}

function initializeDecaySystem(client) {
    // Berjalan setiap jam
    cron.schedule('0 * * * *', () => applyDecay(client));
}

module.exports = { applyDecay, initializeDecaySystem };