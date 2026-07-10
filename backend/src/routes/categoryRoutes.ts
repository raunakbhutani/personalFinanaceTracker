import { Router } from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { categorySchema } from "./schemas";

const router = Router();

router.use(authenticate);

// GET /api/categories - List user categories
router.get("/", getCategories);

// POST /api/categories - Create custom category
router.post("/", validateBody(categorySchema), createCategory);

// DELETE /api/categories/:id - Delete category
router.delete("/:id", deleteCategory);

export default router;
