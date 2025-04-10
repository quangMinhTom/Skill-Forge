 import express from 'express';
 import router from "./routes/userRoute.js";
 import authRouter from "./routes/authRoute.js";
 //import helmet from 'helmet';
 import mongoSanitize from 'express-mongo-sanitize';
 import xss from 'xss-clean';
 import cors from 'cors';

 const app = express();
 //app.use(helmet());
 app.use(express.json());



 //Data sanitation against NoSQL injection
 app.use(mongoSanitize());
 //Data sanitation against XSS
 app.use(xss());

 app.use(cors({
  origin: 'http://localhost:63342', // Allow your frontend origin
  credentials: true // Allow cookies (for JWT cookie)
 }));

 app.use("/api/v1/users",router);
 app.use("/auth",authRouter);

 export default app;
