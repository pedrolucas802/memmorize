import { Router } from "express";
import { AuthController } from "./controllers/auth";
import { GameController } from "./controllers/game";

const authRouter = Router();
const gameRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.post("/register", AuthController.register);

gameRouter.post("/register-match", GameController.registerMatch);
gameRouter.get("/leaderboard", GameController.getLeaderboard);

export { authRouter, gameRouter };
