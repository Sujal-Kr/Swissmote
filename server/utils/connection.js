import mongoose from 'mongoose';


export const connect= async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connection established")
    } catch (err) {
        console.log("Faild to Connect ",err.message)
    }
}