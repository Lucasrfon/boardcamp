import { Router } from "express";
import { getCustomers, postCustomer } from "../controllers/customersController.js";
import { validateCustomer, validateUniqueCpf } from "../middlewares/customersMiddleware.js";

const router = Router();

router.get('/customers', getCustomers);
router.post('/customers', validateCustomer, validateUniqueCpf, postCustomer);

export default router;