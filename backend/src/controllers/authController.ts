import { Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TransactionType } from "@prisma/client";
import { AuthRequest } from "../types";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError } from "../utils/response";

const DEFAULT_CATEGORIES = [
  { name: "Salary", type: TransactionType.INCOME, color: "#22c55e" },
  { name: "Freelance", type: TransactionType.INCOME, color: "#10b981" },
  { name: "Investments", type: TransactionType.INCOME, color: "#14b8a6" },
  { name: "Food & Dining", type: TransactionType.EXPENSE, color: "#f97316" },
  { name: "Transportation", type: TransactionType.EXPENSE, color: "#3b82f6" },
  { name: "Shopping", type: TransactionType.EXPENSE, color: "#ec4899" },
  { name: "Bills & Utilities", type: TransactionType.EXPENSE, color: "#8b5cf6" },
  { name: "Entertainment", type: TransactionType.EXPENSE, color: "#eab308" },
  { name: "Healthcare", type: TransactionType.EXPENSE, color: "#ef4444" },
  { name: "Other", type: TransactionType.EXPENSE, color: "#6b7280" },
];

// POST /api/auth/signup - Register a new user
export async function signup(req: AuthRequest, res: Response): Promise<void> {
  const { email, password, name } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    sendError(res, "Email already registered", 409);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      categories: {
        create: DEFAULT_CATEGORIES,
      },
    },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const token = generateToken(user);
  sendSuccess(res, { user, token }, "Account created successfully", 201);
}

// POST /api/auth/login - Authenticate user and return JWT
export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    sendError(res, "Invalid email or password", 401);
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    sendError(res, "Invalid email or password", 401);
    return;
  }

  const token = generateToken(user);
  sendSuccess(res, {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
}

// GET /api/auth/me - Get current authenticated user
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    sendError(res, "User not found", 404);
    return;
  }

  sendSuccess(res, user);
}

function generateToken(user: { id: string; email: string; name: string }): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: "7d" }
  );
}
