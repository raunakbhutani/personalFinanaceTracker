import { Router } from "express";
import { getBudgets, upsertBudget, deleteBudget } from "../controllers/budgetController";
import { authenticate } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import { budgetSchema, budgetQuerySchema } from "./schemas";

const router = Router();

router.use(authenticate);

// GET /api/budgets - List budgets with spending comparison
router.get("/", validateQuery(budgetQuerySchema), getBudgets);

// POST /api/budgets - Set or update monthly budget
router.post("/", validateBody(budgetSchema), upsertBudget);

// DELETE /api/budgets/:id - Delete budget
router.delete("/:id", deleteBudget);

export default router;
