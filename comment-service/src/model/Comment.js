import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: [true, "Lesson ID is required"],
    },
    content: {
        type: String, // Store Comment content as a JSON object
        required: [true, "Comment content is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    // Auto-add createdAt, updatedAt by Mongoose
    timestamps: true,
});

// Middleware to filter out soft-deleted Comments
CommentSchema.pre('find', function(next) {
    // this.where() represents the current query inside the Mongoose middleware
    this.where({ isDeleted: false });
    next();
});

export default mongoose.model('comment', CommentSchema, 'comments');