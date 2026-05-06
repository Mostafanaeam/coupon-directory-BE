import { PrismaClient } from '@prisma/client';
import "dotenv/config";

// Instantiate without any options
const prisma = new PrismaClient();

async function testConnection() {
  console.log("DATABASE_URL check:", process.env.DATABASE_URL ? "Exists" : "Missing");
  try {
    await prisma.$connect();
    console.log('Connected!');
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
