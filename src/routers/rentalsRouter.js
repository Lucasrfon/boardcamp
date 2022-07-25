import { Router } from "express";
import { getRentals, postRental, removeRental, returnRental } from "../controllers/rentalsController.js";
import { validateRemoveRental, validateRental, validateStock } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get('/rentals', getRentals);

router.post('/rentals', validateRental, validateStock, postRental);
router.post('/rentals/:id/return', returnRental);

router.delete('/rentals/:id', validateRemoveRental, removeRental);

export default router;