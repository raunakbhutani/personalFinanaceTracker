# Personal Finance Tracker

A full-stack personal finance tracking application with a fintech-style dashboard, transaction management, budget tracking, and analytics.

## Tech Stack

### Frontend
- React.js + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- React Router, Axios, Recharts

### Backend
- Node.js + Express.js + TypeScript
- Prisma ORM + PostgreSQL
- JWT authentication + bcrypt

## Project Structure

```
expenseTrackerProject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # User, Transaction, Budget, Category models
│   │   └── seed.ts            # Demo data seeder
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── routes/            # API route definitions + Zod schemas
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Prisma client, response helpers
│   │   └── index.ts           # Express app entry point
│   ├── railway.json           # Railway deployment config
│   └── render.yaml            # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client + API functions
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Sidebar, protected routes
│   │   │   ├── dashboard/     # Metrics, charts
│   │   │   ├── transactions/  # Table, dialog forms
│   │   │   └── budgets/       # Budget dialog
│   │   ├── contexts/          # AuthContext (JWT state)
│   │   ├── pages/             # Route pages
│   │   ├── types/             # Frontend TypeScript interfaces
│   │   └── lib/               # Utility functions
│   └── vercel.json            # Vercel SPA routing config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local, Railway, or Render)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npm run db:push        # Create database tables
npm run db:seed        # Optional: seed demo user
npm run dev            # Start dev server on http://localhost:5000
```

**Demo credentials** (after seeding):
- Email: `demo@finance.com`
- Password: `password123`

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

npm install
npm run dev            # Start dev server on http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/categories` | List categories |
| GET | `/api/budgets` | List budgets with spending |
| POST | `/api/budgets` | Set monthly budget |
| GET | `/api/analytics` | Dashboard analytics |

## Deployment

### Frontend (Vercel)
1. Push `frontend/` to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL=https://your-api.railway.app/api`
4. Deploy

### Backend (Railway or Render)
1. Create a PostgreSQL database
2. Deploy the `backend/` directory
3. Set environment variables:
   - `DATABASE_URL` (from your database provider)
   - `JWT_SECRET` (strong random string)
   - `FRONTEND_URL` (your Vercel URL)
   - `PORT` (usually auto-set)
4. The start command runs `db:push` then starts the server

## Features

- **Authentication**: Signup, login, JWT-protected routes
- **Transactions**: Full CRUD with income/expense types, categories, dates
- **Budgets**: Monthly spending limits with progress tracking
- **Analytics**: Income/expense totals, monthly trends, category breakdown
- **Responsive**: Mobile-friendly sidebar navigation and layouts
