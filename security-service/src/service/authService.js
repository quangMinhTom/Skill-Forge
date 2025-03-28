import User from '../model/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import * as Response from '../middleware/RespondMiddleWare.js';
import * as userService from './userService.js';
import mailService from '../middleware/email.js';
import crypto from 'crypto';

dotenv.config();

function generateJWT(payload){
    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES,
    });
}

export const signUp = async (req,res) => {
  try{
      const newUser = await User.create(
    {
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
          }
      );

      const token = jwt.sign({
          id: newUser._id,
          role: newUser.role,
      }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
      })

      Response.SuccessRespond(res, 201,"User signed up successfully", {newUser,token});

  }catch(err){
      console.log(err);
  }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email or password is missing
        if (!email || !password) {
            return Response.FailedRespond(res, 400, "Email and password are required");
        }

        // Find user, include password for comparison
        const user = await User.findOne({ email }).select('password email role');
        if (!user) {
            return Response.FailedRespond(res, 401, "User not found");
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return Response.FailedRespond(res, 401, "Email and password are incorrect");
        }

        // Generate JWT
        //Add user info into JWT as payload
        const token = jwt.sign({ userId: user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES });

        // Send success response
        Response.SuccessRespond(res,201,"User logged in successfully",{token, user: {email: user.email, id: user._id, role:user.role }});

    } catch (err) {
        Response.FailedRespond(res, 500, false,"Server error");
}}

// Helper to extract and validate token from Authorization header
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, error: 'No token provided or invalid format' };
    }
    return authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
};

// Helper to verify token and handle errors
const verifyToken = async (token, secret) => {
    try {
        return await jwt.verify(token, secret);
    } catch (err) {
        return { success: false, error: 'Invalid or Expired token' };
    }
};

// Verify JWT and return decoded payload
export const verifyJWT = async (req, res) => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        Response.SuccessRespond(res, 201, 'JWT verified', decoded);
    } catch (err) {
        Response.FailedRespond(res, err.message.includes('No token') ? 401 : 500, err.message);
    }
};

// Generate an internal token from a verified JWT
export const generateInternalToken = async (req, res) => {
    try {
        const token = extractToken(req.headers.authorization);
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        const internalToken = await jwt.sign(decoded, process.env.JWT_INTERNAL_SECRET);
        res.set('Authorization', `Bearer ${internalToken}`); // Set internal token in Authorization header
        Response.SuccessRespond(res, 200, 'Internal Token generated', internalToken); // Body can be minimal
    } catch (err) {
        Response.FailedRespond(res, err.message.includes('No token') ? 401 : 500, err.message);
    }
};

export const forgotPassword = async (req, res, next) => {
    try{
        //1. Get user from user email
        const user = await userService.getUserByEmail(req.body.email);


        if (!user)
            return next(Response.FailedRespond(res, 404, false, "User email not found"));

        //2. Generate resetPassword token
        const resetPasswordToken = user.createPasswordResetToken();

        //This will not trigger validator because field in schema do not have validator
        //But since pre save hook ask for passwordConfirm, but since we delete when first create.
        // We fix it by make passwordConfirm optional [required = false]
        //And we PATCH user, not PUT
        await userService.updateUser(user._id, {
            passwordResetToken: user.passwordResetToken, // Hashed token
            passwordResetTokenExpires: user.passwordResetTokenExpires,
        });
        console.log("Password updated successfully!");

        //3. Send it to user email
       mailService({
           recipient: user.email,
           token: resetPasswordToken,
       });

        next(Response.SuccessRespond(res,200,"Reset password sent, check your email"));
    } catch (err){
        Response.FailedRespond(res, 500, "Reset Password Token save failed ");
    }
}

export const resetPassword = async (req, res, next) => {
    //1. Get user using token

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await userService.getUserByProperties(
        {
                    passwordResetToken: hashedToken,
                    passwordResetTokenExpires: {$gt: Date.now()
                 },
        });
    if(!user){
        next(Response.FailedRespond(res, 404, false, "User not found"));
    }

    //2. If token valid, there is a user, reset password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    //3. Update user password
    //4. go to login
    next(Response.SuccessRespond(res, 200, 'Password reset successfully!',generateJWT({id: user._id, role:user.role})));
}