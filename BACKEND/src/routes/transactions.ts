import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  const { period, from, to, workerId } = req.query;

  let dateFilter: { gte?: Date; lte?: Date } = {};
  if (from && to) {
    dateFilter = { gte: new Date(String(from)), lte: new Date(String(to)) };
  } else if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    dateFilter = { gte: start };
  } else if (period === "week") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    dateFilter = { gte: start };
  } else if (period === "month") {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    dateFilter = { gte: start };
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      ...(workerId ? { workerId: Number(workerId) } : {}),
      ...(dateFilter.gte || dateFilter.lte ? { created_at: dateFilter } : {}),
    },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { created_at: "desc" },
  });
  res.json(transactions);
});

router.get("/:id", authenticate, async (req, res) => {
  const transaction = await prisma.transaction.findUnique({
    where: { idTransaction: Number(req.params.id) },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  res.json(transaction);
});

router.post("/", authenticate, authorize("admin", "worker"), async (req, res) => {
  const { workerId, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }

  const transaction = await prisma.$transaction(async (tx) => {
    let total = 0;
    const soldItems = [];

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { idP: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (item.quantity > product.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (available: ${product.quantity})`);
      }
      const unitPrice = item.unitPrice ?? product.price;
      total += unitPrice * item.quantity;

      await tx.product.update({
        where: { idP: product.idP },
        data: { quantity: { decrement: item.quantity } },
      });
      soldItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
    }

    return tx.transaction.create({
      data: { workerId, total, items: { create: soldItems } },
      include: { items: true },
    });
  });

  res.status(201).json(transaction);
});

export default router;