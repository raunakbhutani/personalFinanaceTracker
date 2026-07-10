import { PrismaClient, TransactionType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@finance.com" },
    update: {},
    create: {
      email: "demo@finance.com",
      name: "Demo User",
      passwordHash,
    },
  });

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: cat.name,
          type: cat.type,
        },
      },
      update: {},
      create: {
        ...cat,
        userId: user.id,
      },
    });
  }

  console.log("Seed completed. Demo user: demo@finance.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
