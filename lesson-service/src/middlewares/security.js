import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
// Middleware to verify JWT and extract user data
export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided or invalid format',
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_INTERNAL_SECRET); // e.g., { userId: "user123", role: "admin" }
        console.log("Token in Skill Service= " + token);
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

// Restrict to specific roles
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};