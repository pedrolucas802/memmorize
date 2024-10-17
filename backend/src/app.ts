import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authRouter, gameRouter } from "./routes";
import { cronUpdateLeaderboard } from "./services/scheduler";
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);

console.log("Initializing scheduler...");
cronUpdateLeaderboard.start();

app.listen(5000, () => console.log("Listening on port 5000..."));
