import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true,
    },
    subSkillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSkill",
        required: [true, "SubSkill ID is required"],
    },
    content: {
        type: Object, // Store lesson content as a JSON object
        required: [true, "Lesson content is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    // Auto-add createdAt, updatedAt by Mongoose
    timestamps: true,
});

// Middleware to filter out soft-deleted lessons
lessonSchema.pre('find', function(next) {
    // this.where() represents the current query inside the Mongoose middleware
    this.where({ isDeleted: false });
    next();
});

export default mongoose.model('Lesson', lessonSchema, 'lessons');