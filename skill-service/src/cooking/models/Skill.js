import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: 'A skill to master.',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    //Auto add createdAt, updatedAt by Mongoose
    timestamps: true,
})

skillSchema.pre('find', function(next) {
    //this.where() represents the current query inside the Mongoose middleware.
    this.where({isDeleted: false});
    next();
});

export default mongoose.model('cooking', skillSchema, 'cooking');