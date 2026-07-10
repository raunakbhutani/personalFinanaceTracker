import { Router } from "express";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController";
import { authenticate } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import {
  transactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "./schemas";

const router = Router();

router.use(authenticate);

// GET /api/transactions - List transactions with optional filters
router.get("/", validateQuery(transactionQuerySchema), getTransactions);

// GET /api/transactions/:id - Get single transaction
router.get("/:id", getTransaction);

// POST /api/transactions - Create transaction
router.post("/", validateBody(transactionSchema), createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put("/:id", validateBody(updateTransactionSchema), updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete("/:id", deleteTransaction);

export default router;
