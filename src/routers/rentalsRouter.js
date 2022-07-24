import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentalsController.js";
import { validateRental, validateStock } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', validateRental, validateStock, postRental);

export default router;