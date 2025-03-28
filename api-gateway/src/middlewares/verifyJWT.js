import axios from "axios";
import jwt from "jsonwebtoken";

// Middleware to verify JWT with security service
export const verifyWithSecurityService = async (req, res, next) => {
    //extract token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.get('http://127.0.0.1:9011/auth/internalToken', {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("In gateway, before security=" + req.headers.authorization);
        req.headers.authorization = "Bearer " + response.headers.authorization.split(' ')[1]; // Get "<internal-token>"
        console.log("In gateway, after security=" + req.headers.authorization);
         //req.internalToken = internalToken; // Store the raw internal token

        // Optionally decode it if needed:
        // req.user = jwt.verify(internalToken, process.env.JWT_INTERNAL_SECRET);

        next();
    } catch (err) {
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || 'Token verification failed';
        return res.status(status).json({ success: false, message });
    }
};
