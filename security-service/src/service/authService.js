import User from '../model/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import * as Response from '../middleware/RespondMiddleWare.js';
import * as userService from './userService.js';
import mailService from '../middleware/email.js';
import crypto from 'crypto';

dotenv.config();

// Extracted JWT creation method
const generateJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// Cookie options (adjust as needed)
const cookieOptions = {
    httpOnly: true, // Prevent JS access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'Strict', // CSRF protection
    maxAge: 90 * 24 * 60 * 60 * 1000,
};

export const signUp = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });

        const token = generateJWT({
            id: newUser._id,
            role: newUser.role,
        });

        // Send token in cookie
        res.cookie('jwt', token, cookieOptions);

        // Send token in response body
        Response.SuccessRespond(res, 201, "User signed up successfully", { newUser, token });
    } catch (err) {
        console.log(err);
        Response.FailedRespond(res, 500, "Signup failed");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return Response.FailedRespond(res, 400, "Email and password are required");
        }

        const user = await User.findOne({ email }).select('password email role');
        if (!user) {
            return Response.FailedRespond(res, 401, "User not found");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return Response.FailedRespond(res, 401, "Email and password are incorrect");
        }

        const token = generateJWT({
            id: user._id,
            role: user.role,
        });

        // Send token in cookie
        res.cookie('jwt', token, cookieOptions);

        // Send token in response body
        Response.SuccessRespond(res, 201, "User logged in successfully", {
            token,
            user: { email: user.email, id: user._id, role: user.role },
        });
    } catch (err) {
        Response.FailedRespond(res, 500, "Server error");
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await userService.getUserByEmail(req.body.email);
        if (!user) {
            return next(Response.FailedRespond(res, 404, false, "User email not found"));
        }

        const resetPasswordToken = user.createPasswordResetToken();
        await userService.updateUser(user._id, {
            passwordResetToken: user.passwordResetToken,
            passwordResetTokenExpires: user.passwordResetTokenExpires,
        });
        console.log("Password updated successfully!");

        mailService({
            recipient: user.email,
            token: resetPasswordToken,
        });

        next(Response.SuccessRespond(res, 200, "Reset password sent, check your email"));
    } catch (err) {
        Response.FailedRespond(res, 500, "Reset Password Token save failed");
    }
};

export const resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await userService.getUserByProperties({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(Response.FailedRespond(res, 404, false, "User not found"));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    const token = generateJWT({
        id: user._id,
        role: user.role,
    });

    // Send token in cookie
    res.cookie('jwt', token, cookieOptions);

    // Send token in response body
    next(Response.SuccessRespond(res, 200, 'Password reset successfully!', { token }));
};

// Other functions (unchanged since no JWT creation in response)
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, error: 'No token provided or invalid format' };
    }
    return authHeader.split(' ')[1];
};

const verifyToken = async (token, secret) => {
    try {
        return await jwt.verify(token, secret);
    } catch (err) {
        return { success: false, error: 'Invalid or Expired token' };
    }
};

export const verifyJWT = async (req, res) => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        Response.SuccessRespond(res, 201, 'JWT verified', decoded);
    } catch (err) {
        Response.FailedRespond(res, err.message.includes('No token') ? 401 : 500, err.message);
    }
};

export const generateInternalToken = async (req, res) => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        const internalToken = await jwt.sign(decoded, process.env.JWT_INTERNAL_SECRET);
        res.set('Authorization', `Bearer ${internalToken}`);
        Response.SuccessRespond(res, 200, 'Internal Token generated', internalToken);
    } catch (err) {
        Response.FailedRespond(res, err.message.includes('No token') ? 401 : 500, err.message);
    }
};