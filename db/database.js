import mongoose from "mongoose"
import dotenv from 'dotenv';

dotenv.config({
    path:'./.env'
})

const connectDB =()=>{
    mongoose.connect(process.env.DB).then(()=>{
        console.log("The server is connected to the database");
    }).catch(()=>{
        console.log("There are some error with connecting to the database")
    })
}

export default connectDB;