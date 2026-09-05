import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  const provides = await prisma.provide.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { created_at: "desc" },
  });
  res.json(provides);
});

router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  const provide = await prisma.provide.findUnique({
    where: { idProvide: Number(req.params.id) },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!provide) return res.status(404).json({ error: "Provide not found" });
  res.json(provide);
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { ProviderId, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }

  const provide = await prisma.$transaction(async (tx) => {
    let total = 0;
    const providedItems = [];

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { idP: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const unitPrice = item.unitPrice ?? product.cost;
      total += unitPrice * item.quantity;

      await tx.product.update({
        where: { idP: product.idP },
        data: { quantity: { increment: item.quantity } },
      });
      providedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
    }

    return tx.provide.create({
      data: { ProviderId, total, items: { create: providedItems } },
      include: { items: true },
    });
  });

  res.status(201).json(provide);
});

export default router;