import express from 'express';
import morgan from 'morgan';
import Skillrouter from './cooking/routes/router.js';
import cors from 'cors';
const app = express();

app.use(cors({
    origin: 'http://localhost:63342', // Allow your frontend origin
    credentials: true // Allow cookies (for JWT cookie)
}));

//Convert req.body into json
app.use(express.json());



if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use("/api/v1/sub-skills",Skillrouter);





export default app;