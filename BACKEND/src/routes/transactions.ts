import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: { items: true, user: true },
  });
  res.json(transactions);
});

router.get("/:id", async (req, res) => {
  const transaction = await prisma.transaction.findUnique({
    where: { idTransaction: Number(req.params.id) },
    include: { items: true, user: true },
  });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  res.json(transaction);
});

router.post("/", async (req, res) => {
  const { workerId, items } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      workerId,
      total: items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0),
      items: {
        create: items,
      },
    },
    include: { items: true },
  });
  res.status(201).json(transaction);
});

export default router;
