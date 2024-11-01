const VirtualPet = require('../models/VirtualPets');
const User = require('../models/user');

async function rewardUser(pet, action) {
    if (!pet || !pet instanceof VirtualPet) {
        throw new Error('Invalid pet object provided');
    }

    if (!['play', 'feed'].includes(action)) {
        throw new Error('Invalid action provided');
    }

    let rewardMessage = '';
    let reward = 0;

    const user = await User.findOne({ userId: pet.userId });
    if (!user) {
        console.log(`User not found for pet ${pet.petName} (ID: ${pet.userId})`);
        return null;
    }

    try {
        // Reward dasar untuk bermain dan memberi makan hewan
        switch (action) {
            case 'play':
                reward = 500;
                break;
            case 'feed':
                reward = 100;
                break;
        }
        
        user.balance += reward;
        
        let formattedReward = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(reward);
        
        rewardMessage = `You earned ${formattedReward} for ${action}ing your pet!`;
        
        // Bonus untuk yang rajin merawat hewannya
        if (pet.happiness >= 90 && pet.energy >= 90) {
            const bonusReward = 2000;
            user.balance += bonusReward;
            
            formattedReward = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(bonusReward);
            
            rewardMessage += `\nYour pet is in great condition! You received ${formattedReward} as a bonus!`;
        }
        
        await user.save();
        return rewardMessage;
    } catch (error) {
        console.error(`Error rewarding user for ${action}:`, error);
        return null;
    }
}
  
module.exports = rewardUser;