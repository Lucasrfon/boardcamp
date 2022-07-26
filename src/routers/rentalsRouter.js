import { Router } from "express";
import { caculateMetrics, getRentals, postRental, removeRental, returnRental } from "../controllers/rentalsController.js";
import { validateRemoveRental, validateRental, validateReturnRental, validateStock } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get('/rentals', getRentals);
router.get('/rentals/metrics', caculateMetrics);

router.post('/rentals', validateRental, validateStock, postRental);
router.post('/rentals/:id/return', validateReturnRental, returnRental);

router.delete('/rentals/:id', validateRemoveRental, removeRental);

export default router;