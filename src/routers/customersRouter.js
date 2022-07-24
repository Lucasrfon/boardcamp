import { Router } from "express";
import { getCustomers } from "../controllers/customersController.js";

const router = Router();

router.get('/customers', getCustomers);
router.post('/customers');

export default router;