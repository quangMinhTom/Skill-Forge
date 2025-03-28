import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import isEmail from 'validator/lib/isEmail.js';
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true, // Remove leading/trailing whitespace
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            validate: {
                validator:isEmail, // Uses validator.js
                message: 'Please provide a valid email address',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Password confirmation is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        photo: {
            type: String,
            default: 'default.jpg', // Default photo if none provided
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'creator'],
                message: 'Role must be either "user", or "creator"',
            },
            default: 'user',
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetTokenExpires: {
            type: Date,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Pre-find and pre-save hooks remain unchanged
userSchema.pre('find', function (next) {
    if (!this.getQuery().hasOwnProperty('isDeleted')) {
        this.where({ isDeleted: false });
    }
    next();
});


// Single pre-save hook for password validation and hashing
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            // Validate password confirmation
            if (this.password !== this.passwordConfirm) {
                return next(new Error('Password and confirmation do not match'));
            }

            // Hash the password
            this.password = await bcrypt.hash(this.password, 12);

            // Clear passWordConfirm after validation and hashing
            this.passwordConfirm = undefined;

        }
        next();
    } catch (err) {
        next(err); // Pass any bcrypt errors to Mongoose
    }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    //Store hashed reset password token
    this.passwordResetToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
    //expire in 10 min
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    console.log('PasswordResetToken= '+ this.passwordResetToken + " reset password token = " + resetPasswordToken);

    return resetPasswordToken;
}


export default mongoose.model('User', userSchema,'user');