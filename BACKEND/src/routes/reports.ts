import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

function dateRange(period?: string, from?: string, to?: string): { gte?: Date; lte?: Date } {
  if (from && to) {
    return { gte: new Date(from), lte: new Date(to) };
  }
  const now = new Date();
  if (period === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { gte: start };
  }
  if (period === "week") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { gte: start };
  }
  if (period === "month") {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    return { gte: start };
  }
  return {};
}

async function productPerformance(range: { gte?: Date; lte?: Date }) {
  const items = await prisma.transactionItem.findMany({
    where: range.gte || range.lte ? { transaction: { created_at: range } } : {},
    include: { product: true },
  });

  const perf = new Map<number, { product: any; quantitySold: number; revenue: number }>();
  for (const item of items) {
    const entry = perf.get(item.productId) || {
      product: item.product,
      quantitySold: 0,
      revenue: 0,
    };
    entry.quantitySold += item.quantity;
    entry.revenue += item.quantity * item.unitPrice;
    perf.set(item.productId, entry);
  }
  return Array.from(perf.values());
}

router.get("/summary", authenticate, authorize("admin"), async (req, res) => {
  const { period, from, to } = req.query;
  const range = dateRange(period as string, from as string, to as string);

  const transactions = await prisma.transaction.findMany({
    where: range.gte || range.lte ? { created_at: range } : {},
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;

  res.json({
    period: period || "all",
    totalRevenue,
    totalTransactions,
    averageSale: totalTransactions ? totalRevenue / totalTransactions : 0,
  });
});

router.get("/top-products", authenticate, authorize("admin"), async (req, res) => {
  const { period, from, to } = req.query;
  const limit = Number(req.query.limit) || 5;
  const range = dateRange(period as string, from as string, to as string);

  const perf = await productPerformance(range);
  perf.sort((a, b) => b.quantitySold - a.quantitySold);
  res.json(perf.slice(0, limit));
});

router.get("/lowest-products", authenticate, authorize("admin"), async (req, res) => {
  const { period, from, to } = req.query;
  const limit = Number(req.query.limit) || 5;
  const range = dateRange(period as string, from as string, to as string);

  const perf = await productPerformance(range);
  perf.sort((a, b) => a.quantitySold - b.quantitySold);
  res.json(perf.slice(0, limit));
});

router.get("/alerts", authenticate, authorize("admin"), async (req, res) => {
  const products = await prisma.product.findMany();
  res.json({
    lowStock: products.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity),
    outOfStock: products.filter((p) => p.quantity === 0),
  });
});

router.get("/daily", authenticate, authorize("admin"), async (req, res) => {
  const date = String(req.query.date || "");
  const day = date ? new Date(date) : new Date();
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
    where: { created_at: { gte: start, lte: end } },
    include: { items: true, user: true },
    orderBy: { created_at: "asc" },
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  res.json({
    date: start.toISOString().slice(0, 10),
    totalRevenue,
    totalTransactions: transactions.length,
    transactions,
  });
});

router.get("/monthly", authenticate, authorize("admin"), async (req, res) => {
  const month = String(req.query.month || "");
  const now = new Date();
  const start = month
    ? new Date(`${month}-01T00:00:00`)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const transactions = await prisma.transaction.findMany({
    where: { created_at: { gte: start, lte: end } },
    include: { items: true },
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const perf = await productPerformance({ gte: start, lte: end });
  perf.sort((a, b) => b.revenue - a.revenue);

  res.json({
    month: start.toISOString().slice(0, 7),
    totalRevenue,
    totalTransactions: transactions.length,
    bestProducts: perf.slice(0, 5),
    worstProducts: perf.slice(-5).reverse(),
  });
});

export default router;