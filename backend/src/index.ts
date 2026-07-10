// Backend entry point for the FinTrack API. This file creates the Express app,
// wires middleware and routes, and starts the server.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS - allow frontend origin (Vercel or localhost)
// When FRONTEND_URL is "*" we allow all origins (dev/testing only).
// With credentials:true, browsers reject a literal "*" origin, so we
// use a function that reflects the request origin instead.
const rawOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = rawOrigin.split(",").map((s) => s.trim());

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow server-to-server requests (no Origin header) or wildcard mode
      if (!requestOrigin || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${requestOrigin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint for Railway/Render
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Finance Tracker API running on port ${PORT}`);
});

export default app;
