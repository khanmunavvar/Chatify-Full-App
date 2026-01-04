import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
     //if connection failed tells user about error
    console.log(`Error: ${error.message}`);
    //if connection failed exit the process
    process.exit(1); 
    
  }
};

export default connectDB;