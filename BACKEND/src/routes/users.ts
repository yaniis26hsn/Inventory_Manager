import { Router } from "express";
import type { Role } from "@prisma/client";
import { prisma } from "../prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { idU: Number(req.params.id) },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { age, lname, fname, password, username, role } = req.body;
  const user = await prisma.user.create({
    data: { age, lname, fname, password, username, role: role as Role },
  });
  res.status(201).json(user);
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  const { age, lname, fname, password, username, role } = req.body;
  const user = await prisma.user.update({
    where: { idU: Number(req.params.id) },
    data: { age, lname, fname, password, username, role: role as Role },
  });
  res.json(user);
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  await prisma.user.delete({ where: { idU: Number(req.params.id) } });
  res.status(204).send();
});

export default router;