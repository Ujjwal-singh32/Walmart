import mongoose from "mongoose";

const connectDB = async()=>{
    if (mongoose.connections[0].readyState) {
        console.log("🟢 Already connected to DB.");
        return;
      }

    mongoose.connection.on('connected',()=>{
        console.log('🟢 DB Connected')
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/Amazon`)
}

export default connectDB;