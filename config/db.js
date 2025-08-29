import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
    console.log("Connected to database ✅✅");
  } catch (error) {
    console.log("Error while connecting data base: ", error);
  }
};

export default connectDB;
