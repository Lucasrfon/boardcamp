import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesController.js";
import { validateGame, validateUniqueGame } from "../middlewares/gamesMiddleware.js";

const router = Router();

router.get('/games', getGames);
router.post('/games', validateGame, validateUniqueGame, postGame);

export default router;