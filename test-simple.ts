import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Try setting it in the env variable directly inside the process.env before initialization
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_DSGMb6cVIX3g@ep-noisy-band-anhbc9ci-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected!");
    } catch (e) {
        console.error(e);
    }
}
main();
