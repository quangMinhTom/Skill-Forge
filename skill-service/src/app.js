import express from 'express';
import morgan from 'morgan';
import Skillrouter from './cooking/routes/router.js';
const app = express();
//Convert req.body into json
app.use(express.json());
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use("/api/v1/skills",Skillrouter);





export default app;