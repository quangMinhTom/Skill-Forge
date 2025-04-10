import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
//Load content from .env into process.env
dotenv.config();

const DBconnection = process.env.DB_ATLAS.replace('<DB_PASSWORD>',process.env.DB_PASSWORD);

mongoose.connect(DBconnection
    // {useNewUrlParser:true
    // ,useUnifiedTopology:true}
).then(()=>console.log('DB connected successfully'))
.catch(err=>console.log(err));



app.listen(process.env.SERVER_PORT,process.env.SERVER_HOST,()=>
    {
    console.log(`server is running on port ${process.env.SERVER_PORT}`)
    }
);