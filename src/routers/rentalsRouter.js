import { Router } from "express";
import { postRental } from "../controllers/rentalsController.js";

const router = Router();

router.get('/rentals');
router.post('/rentals', postRental);

export default router;