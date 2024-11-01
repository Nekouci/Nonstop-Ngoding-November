const VirtualPet = require('../models/VirtualPets');
const energyRegenerationInterval = 15 * 60 * 1000; // 15 menit
const energyRegenAmount = 5; // Jumlah energi yang terregenerasi per interval
const maxEnergy = 100; // Batas maks energi

// Sistem rebahan anjay
async function recoveryEnergy() {
    try {
        const pets = await VirtualPet.find(); // Mencari semua hewan user tanpa terkecuali
      
        const currentTime = new Date();
      
        for (let pet of pets) {
            // Mengecek apabila energi hewan berada dibawah batas maks dan akan meregenerasi apabila
            // terakhir kali istirahat yaitu lebih dari 15 menit yang lalu (buset anak rebahan beneran ini mah)
            const timeSinceLastRest = currentTime - pet.lastRested;
            if (pet.energy < maxEnergy && timeSinceLastRest >= energyRegenerationInterval) {
                pet.energy = Math.min(pet.energy + energyRegenAmount, maxEnergy);
                pet.lastRested = currentTime; // Update waktu terakhir kali istirahat
                await pet.save();
            }
        }
    } catch (error) {
        console.log(`Error when recovering pet energy:`);
        console.error(error);
    }
}

module.exports = { recoveryEnergy };