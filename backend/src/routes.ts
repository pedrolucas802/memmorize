import { Router } from "express";
import { AuthController } from "./controllers/auth";
import { GameController } from "./controllers/game";
import authMiddleware from "./middlewares/auth";

const authRouter = Router();
const gameRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);

gameRouter.post(
  "/register-match",
  authMiddleware,
  GameController.registerMatch
);
gameRouter.get("/leaderboard", authMiddleware, GameController.getLeaderboard);

export { authRouter, gameRouter };
