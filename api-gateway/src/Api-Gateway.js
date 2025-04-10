
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan, {token} from 'morgan';
import { createProxyMiddleware } from "http-proxy-middleware";
import {verifyWithSecurityService} from "./middlewares/verifyJWT.js";

dotenv.config();
// Create an instance of Express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:63342', // Allow your frontend origin
    credentials: true // Allow cookies (for JWT cookie)
}));


// Middleware setup
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

const services = [
    { route: '/api/v1/user', target: 'http://localhost:9011/api/v1/user', isProtected: true },
    { route: '/skills', target: 'http://localhost:9001/api/v1/skills', isProtected: true },
    { route: '/sub-skills', target: 'http://localhost:9002/api/v1/sub-skills', isProtected: true },
    { route: '/lessons', target: 'http://localhost:9003/api/v1/lessons', isProtected: true },
    { route: '/users', target: 'http://localhost:9011/api/v1/users', isProtected: true }
];

// Define rate limit constants
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

// Object to store request counts for each IP address
const requestCounts = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0; // Reset request count for each IP address
    });
}, interval);

// Middleware function for rate limiting and timeout handling
function rateLimitAndTimeout(req, res, next) {
    const ip = req.ip; // Get client IP address

    // Update request count for the current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // Check if request count exceeds the rate limit
    if (requestCounts[ip] > rateLimit) {
        // Respond with a 429 Too Many Requests status code
        return res.status(429).json({
            code: 429,
            status: "Error",
            message: "Rate limit exceeded.",
            data: null,
        });
    }

    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(15000, () => {
        // Handle timeout error
        res.status(504).json({
            code: 504,
            status: "Error",
            message: "Gateway timeout.",
            data: null,
        });
        req.abort(); // Abort the request
    });

    next(); // Continue to the next middleware
}

// Apply the rate limit and timeout middleware to the proxy
//A catch-all safety net — protects the Gateway from overload
// or slow requests across all endpoints, even unregistered ones.
app.use(rateLimitAndTimeout);


// Set up proxy middleware for each microservice
// Apply rate limiting and timeout middleware before proxying
//Adds route-specific logic—applies the same protection plus proxying only to registered routes.

//The client’s TCP connection is with 9000
// createProxyMiddleware manages a separate connection to 9001, invisible to the client.

// Reverse proxy (via createProxyMiddleware) naturally hides backend IPs—client only sees Gateway.
services.forEach(service => {
    // app.use(service.route, createProxyMiddleware({
    //     target: service.target,
    //     changeOrigin: true,
    //     pathRewrite: {
    //         pathRewrite: { [`^${service.route}`]: "" }, // Adjust based on service
    //     },
    // }));

    //proxyReq: This is an object representing the outgoing HTTP request that the http-proxy-middleware library creates to
    // forward the client’s request to the target service (e.g., http://localhost:9001/api/v1/skill for the /skill route).
    // Type: It’s an instance of Node.js’s http.ClientRequest,
    //     which allows you to modify the request (e.g., headers, method) before it’s sent to the target.
    const proxyOptions = {
        target: service.target,
        changeOrigin: true,
        pathRewrite: { [`^${service.route}`]: '' },
        on: {
            proxyReq:(proxyReq, req) => {
                if (req.headers.authorization) {
                    proxyReq.setHeader('Authorization', req.headers.authorization); // Use token set by middleware
                }
            }
        },
    };

    app.use(
        service.route,
        service.isProtected ? [verifyWithSecurityService, createProxyMiddleware(proxyOptions)] : createProxyMiddleware(proxyOptions)
    );
});


app.use((_req, res) => {
    res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
    });
});


app.listen(process.env.PORT,process.env.HOST, () => {
    console.log(`Gateway is running on port ${process.env.PORT}`);
});