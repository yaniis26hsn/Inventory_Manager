import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get("/all", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get("/verify-storage", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { quantity: { lte: prisma.product.fields.minQuantity } },
  });
  res.json(products);
});

router.get("/out-of-stock", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { quantity: 0 },
  });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { idP: Number(req.params.id) },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const { name, quantity, minQuantity, price, cost, barcode, category } = req.body;
  const product = await prisma.product.create({
    data: { name, quantity, minQuantity, price, cost, barcode, category },
  });
  res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
  const { name, quantity, minQuantity, price, cost, barcode, category } = req.body;
  const product = await prisma.product.update({
    where: { idP: Number(req.params.id) },
    data: { name, quantity, minQuantity, price, cost, barcode, category },
  });
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  await prisma.product.delete({ where: { idP: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
