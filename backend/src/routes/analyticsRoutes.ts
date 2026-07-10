import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { authenticate } from "../middleware/auth";
import { validateQuery } from "../middleware/validate";
import { analyticsQuerySchema } from "./schemas";

const router = Router();

router.use(authenticate);

// GET /api/analytics - Dashboard analytics and reports
router.get("/", validateQuery(analyticsQuerySchema), getAnalytics);

export default router;
