import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const provides = await prisma.provide.findMany({
    include: { items: true, user: true },
  });
  res.json(provides);
});

router.get("/:id", async (req, res) => {
  const provide = await prisma.provide.findUnique({
    where: { idProvide: Number(req.params.id) },
    include: { items: true, user: true },
  });
  if (!provide) return res.status(404).json({ error: "Provide not found" });
  res.json(provide);
});

router.post("/", async (req, res) => {
  const { ProviderId, items } = req.body;
  const provide = await prisma.provide.create({
    data: {
      ProviderId,
      total: items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0),
      items: {
        create: items,
      },
    },
    include: { items: true },
  });
  res.status(201).json(provide);
});

export default router;
