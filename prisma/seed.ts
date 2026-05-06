import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { username }
  });
  
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword
    }
  });
  
  console.log('Admin user created:', admin.username);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
