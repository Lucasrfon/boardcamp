import { Router } from "express";
import { postRental } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get('/rentals');
router.post('/rentals', validateRental, postRental);

export default router;