import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: "users-management",
    });

    console.log("Database Connected ....");
  } catch (error) {
    console.log("Error connecting Database ", error.message);
  }
}
