import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

const pool = mariadb.createPool({ uri: process.env.DATABASE_URL });
const adapter = new PrismaMariaDb(pool);
export const prisma = new PrismaClient({ adapter });
