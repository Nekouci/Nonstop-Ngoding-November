const {Schema, model} = require('mongoose');

const virtualPetSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        petName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 32,
        },
        petType: {
            type: String,
            enum: ['bird', 'cat', 'dog', 'fish', 'guineaPig', 'hamster', 'rabbit', 'turtle'],
            required: true,
        },
        petEmoji: {
            type: String,
            required: true,
        },
        evolutionName: {
            type: String,
            default: 'Baby',
            enum: ['Baby', 'Juvenile', 'Teen', 'Adult', 'Elder'],
        },
        happiness: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        hunger: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        energy: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        levelUpThreshold: {
            type: Number,
            default: 100,
            min: 100,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        evolutionStage: {
            type: Number,
            default: 1,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an integer'
            }
        },
        lastInteraction: {
            type: Date,
            default: Date.now,
        },
        lastRested: {
            type: Date,
            default: Date.now,
        }
    },
    {
        // Membuat timestamp mengenai kapan data dibuat pertama kali dan kapan terakhir kali di update
        timestamps: true,
        // Menggunakan indeks pada userId, petType, level agar pencarian data jadi lebih mudah dan cepat
        indexes: [
            { userId: 1 },
            { petType: 1 },
            { level: -1 }
        ]
    }
);

// Middleware, memastikan untuk beberapa value data berada di rentang yang benar
virtualPetSchema.pre('save', function(next) {
    this.happiness = Math.min(Math.max(this.happiness, 0), 100);
    this.hunger = Math.min(Math.max(this.hunger, 0), 100);
    this.energy = Math.min(Math.max(this.energy, 0), 100);
    this.level = Math.max(this.level, 1);
    this.experience = Math.max(this.experience, 0);
    this.evolutionStage = Math.min(Math.max(this.evolutionStage, 1), 5);
    
    next();
});

module.exports = model('VirtualPet', virtualPetSchema);