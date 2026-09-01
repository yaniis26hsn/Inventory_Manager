import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { idU: Number(req.params.id) },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { age, lname, fname, password, username, role } = req.body;
  const user = await prisma.user.create({
    data: { age, lname, fname, password, username, role },
  });
  res.status(201).json(user);
});

router.put("/:id", async (req, res) => {
  const { age, lname, fname, password, username, role } = req.body;
  const user = await prisma.user.update({
    where: { idU: Number(req.params.id) },
    data: { age, lname, fname, password, username, role },
  });
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  await prisma.user.delete({ where: { idU: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
