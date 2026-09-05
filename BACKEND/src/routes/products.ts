import { Router } from "express";
import type { Category } from "@prisma/client";
import { prisma } from "../prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  const { search, category, stock } = req.query;
  const products = await prisma.product.findMany({
    where: {
      ...(search ? { name: { contains: String(search) } } : {}),
      ...(category ? { category: String(category) as Category } : {}),
    },
  });

  let result = products;
  if (stock === "out") {
    result = products.filter((p) => p.quantity === 0);
  } else if (stock === "low") {
    result = products.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity);
  } else if (stock === "in") {
    result = products.filter((p) => p.quantity > p.minQuantity);
  }

  res.json(result);
});

router.get("/all", authenticate, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get("/verify-storage", authenticate, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products.filter((p) => p.quantity <= p.minQuantity));
});

router.get("/out-of-stock", authenticate, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products.filter((p) => p.quantity === 0));
});

router.get("/:id", authenticate, async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { idP: Number(req.params.id) },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { name, quantity, minQuantity, price, cost, barcode, category } = req.body;
  const product = await prisma.product.create({
    data: { name, quantity, minQuantity, price, cost, barcode, category },
  });
  res.status(201).json(product);
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  const { name, quantity, minQuantity, price, cost, barcode, category } = req.body;
  const product = await prisma.product.update({
    where: { idP: Number(req.params.id) },
    data: { name, quantity, minQuantity, price, cost, barcode, category },
  });
  res.json(product);
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  await prisma.product.delete({ where: { idP: Number(req.params.id) } });
  res.status(204).send();
});

export default router;