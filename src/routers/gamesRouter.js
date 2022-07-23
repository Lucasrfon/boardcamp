import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesController.js";

const router = Router();

router.get('/games', getGames);
router.post('/games', postGame);

export default router;