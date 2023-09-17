import { config } from "dotenv";
import express from "express";
import router from "./routes";
import cors from "cors";
import userRouter from "./routes/user";
import eventsRouter from "./routes/events";
import { Session } from "inspector";
import cronProcesses from "@utils/cron/cron";
import connectDB from "./libs/db";
config();
const app = express();

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
    exposedHeaders:
      "Authorization,Expiration,Refresh-Expiration,authentication",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//running cron procces
cronProcesses();

//DB connection
connectDB()

// Define routes
app.use("/api/v1-0-0", router);
app.use("/api/v1-0-0", userRouter);
app.use("/api/v1-0-0", eventsRouter);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
//tsc --project tsconfig.json && tsc-alias -p tsconfig.json