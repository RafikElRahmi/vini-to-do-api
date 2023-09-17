import logError from "@utils/logger";
import mongoose from "mongoose";

function connectDB() {
    const DB_URI: string = `${process.env.DB_URI}`;
    mongoose
      .connect(DB_URI)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        logError(`${err}`);
      });
}

export default connectDB;