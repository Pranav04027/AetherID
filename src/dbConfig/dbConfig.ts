import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

export default async function dbConnect() {
  try {
    if (isConnected) {
      console.log("Database already connected");
      return;
    } else {
      const connection = await mongoose.connect(process.env.MONGODB_URI!);

      mongoose.connection.on("connected", () => {
        console.log("Database connected successfully");
      });

      mongoose.connection.on("error", (err) => {
        console.error(`Database connection error: ${err}`);
      });

      return connection;
    }
  } catch (error) {
    throw new Error("Failed to connect to the database");
  }
}
