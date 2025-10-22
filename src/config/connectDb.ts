import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "StringAnalyserDB",
    });
    console.log("MongoDB Connected");
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
