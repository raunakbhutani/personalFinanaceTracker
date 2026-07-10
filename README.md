# FinTrack

FinTrack is a full-stack personal finance tracker built with React, TypeScript, Node.js, Express, Prisma, and PostgreSQL. It helps users manage income and expenses, set monthly budgets, track analytics, and review recent transactions through a polished dashboard.

## Features

- Secure authentication with JWT
- Transaction CRUD for income and expense entries
- Budget creation and progress tracking by category
- Dashboard analytics with totals, monthly trend, category breakdown, and budget comparison
- Responsive UI with light/dark theme support

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Recharts, React Router, Axios

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT + bcrypt

## Project Structure

```text
expenseTrackerProject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── types/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── lib/
│       ├── pages/
│       └── types/
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

## Environment Setup

### Backend

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Update the values in `.env`:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (optional)
   - `FRONTEND_URL`

### Frontend

1. Copy the example file:
   ```bash
   cd frontend
   cp .env.example .env
   ```
2. Update `VITE_API_URL` if your backend is running on a different URL.

## Installation

### Backend

```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

The backend runs on `http://localhost:5001` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/categories`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/analytics`

## Deployment Notes

### Frontend
- Deploy the `frontend` folder to Vercel.
- Set `VITE_API_URL` to your deployed backend URL.

### Backend
- Deploy the `backend` folder to Railway or Render.
- Set the same environment variables from `.env` in the hosting platform.

## Security Notes

- Never commit real `.env` files to Git.
- Use strong secrets in production.
- Keep your database credentials and JWT secret private.
