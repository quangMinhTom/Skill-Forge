import mongoose from 'mongoose';

const subSkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Sub-skill name is required"], // Added validation message
        trim: true, // Remove leading/trailing spaces
        unique: true,
    },
    description: {
        type: String,
        default: "A sub-skill to master.",
        trim: true,
    },
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: [true, "Skill ID is required"], // Added validation message
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Auto-adds createdAt & updatedAt

subSkillSchema.pre('find',function(next){
    this.where({
        isDeleted: false,
    });
    next();
});

export default mongoose.model('SubSkill', subSkillSchema,'cooking');