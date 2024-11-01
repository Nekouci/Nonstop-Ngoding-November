const VirtualPet = require('../models/VirtualPets');

const EVOLUTION_STAGES = [
    { stage: 1, levelRequirement: 1, name: "Baby" },
    { stage: 2, levelRequirement: 5, name: "Juvenile" },
    { stage: 3, levelRequirement: 10, name: "Teen" },
    { stage: 4, levelRequirement: 15, name: "Adult" },
    { stage: 5, levelRequirement: 20, name: "Elder" },
];

async function checkAndHandleEvolution(VirtualPet) {
    for (let evolution of EVOLUTION_STAGES) {
      if (VirtualPet.level >= evolution.levelRequirement && VirtualPet.evolutionStage < evolution.stage) {
        VirtualPet.evolutionStage = evolution.stage;
        VirtualPet.evolutionName = evolution.name;
        await VirtualPet.save();
  
        return evolution.name; // Mengembalikan value dari evolusi hewan untuk diberitahukan kepada user
      }
    }
    return null; // Jika hewan tidak mengalami evolusi baru, yaudah :v
};

module.exports = { checkAndHandleEvolution };