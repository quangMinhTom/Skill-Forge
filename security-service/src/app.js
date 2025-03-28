 import express from 'express';
 import router from "./routes/userRoute.js";
 import authRouter from "./routes/authRoute.js";

 const app = express();
 app.use(express.json());
 app.use("/api/v1/user",router);
 app.use("/auth",authRouter);

 export default app;
