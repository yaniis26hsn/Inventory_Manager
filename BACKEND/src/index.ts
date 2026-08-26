import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

const pool = mariadb.createPool({ uri: process.env.DATABASE_URL });
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
