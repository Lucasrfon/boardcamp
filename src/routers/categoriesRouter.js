import { Router } from "express";
import { getCategories, postCategory } from "../controllers/categoriesController.js";
import { validateCategory, validateUniqueName } from "../middlewares/categoriesMiddleware.js";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', validateCategory, validateUniqueName, postCategory);

export default router;