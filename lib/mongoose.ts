import mongoose, { ConnectOptions } from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    return "Mongo_URI is not defined";
  }

  if (isConnected) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "twitter",
      autoCreate: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    console.log("Connected to database");
    isConnected = true;
  } catch (error) {
    console.log("Error connecting to database");
  }
};
