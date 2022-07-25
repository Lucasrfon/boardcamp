import { Router } from "express";
import { getCustomers, postCustomer, updateCustomer } from "../controllers/customersController.js";
import { validateCustomer, validateIdCustomer, validateUniqueCpf } from "../middlewares/customersMiddleware.js";

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', validateIdCustomer, getCustomers);

router.put('/customers/:id', validateIdCustomer, validateCustomer, validateUniqueCpf, updateCustomer);

router.post('/customers', validateCustomer, validateUniqueCpf, postCustomer);

export default router;