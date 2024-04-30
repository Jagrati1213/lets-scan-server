import mongoose from "mongoose";
import { DB_NAME } from "../constants";

export async function ConnectionWithMongoDb() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log("DATABASE HOSTED AT", connectionInstance.connection.host);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
}
