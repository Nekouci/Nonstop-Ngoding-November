const VirtualPet = require('../models/VirtualPets');
const { checkAndHandleEvolution } = require('./petEvolutionSystem');

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function addExperience(pet) {
    if (!pet || !pet instanceof VirtualPet) {
        throw new Error('Invalid pet object provided');
    }

    pet.experience += getRandomXp(5, 15);
    pet.lastInteraction = new Date(); // Update waktu interaksi terakhir
    
    if (pet.experience >= pet.levelUpThreshold) {
        pet.experience -= pet.levelUpThreshold;
        pet.level += 1;
        pet.levelUpThreshold = Math.floor(pet.levelUpThreshold * 1.2);
      
        const newEvolutionName = await checkAndHandleEvolution(pet);
        await pet.save();
      
        return {
            leveledUp: true,
            newLevel: pet.level,
            newEvolution: newEvolutionName,
        };
    }
    
    await pet.save();
    return { leveledUp: false };
}

module.exports = addExperience;