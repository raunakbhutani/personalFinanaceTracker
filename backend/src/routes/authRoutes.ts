// Auth routes define the public authentication endpoints for signup and login.
import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "./schemas";

const router = Router();

// POST /api/auth/signup - Register new user
router.post("/signup", validateBody(signupSchema), signup);

// POST /api/auth/login - Login and receive JWT
router.post("/login", validateBody(loginSchema), login);

// GET /api/auth/me - Get current user (protected)
router.get("/me", authenticate, getMe);

export default router;
