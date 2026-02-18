import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import { initSocket } from "./socket.js";
import logController from "./controllers/logController.js"
import router from "./routes/logRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: " Backend is running" });
});

app.use("/", router);

const server = http.createServer(app);

initSocket(server);

const DB = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .set("strictQuery", true)
  .connect(DB, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("connected to the database");

    setInterval(() => {
      logController.generateLog();
    }, 1000);

    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("cannot connect db", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!");
});
