import mongoose, { mongo } from "mongoose";

// Function to connect to the mongodb database

export const ConnectDB = async()=>{
    try{
        mongoose.connection.on('connected',()=>{
            console.log('Database Connected Successfully')
        })
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    }catch(error){
        console.log(error);
    }
}