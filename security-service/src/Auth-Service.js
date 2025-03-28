import app from "./app.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();


const DBconnection = process.env.DB_ATLAS.replace('<DB_PASSWORD>',process.env.DB_PASSWORD);

mongoose.connect(DBconnection
    // {useNewUrlParser:true
    // ,useUnifiedTopology:true}
).then(()=>console.log('DB connected successfully'))
    .catch(err=>console.log(err));

app.listen(process.env.PORT, process.env.HOST,() => {
    console.log("Server started on port: " + process.env.PORT);
});