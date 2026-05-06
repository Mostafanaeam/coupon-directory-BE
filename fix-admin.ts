import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });
  
  if (!admin) {
    console.log('No admin found');
    return;
  }
  
  console.log('Admin found:', admin.username);
  
  const isValid = await bcrypt.compare('admin123', admin.password);
  console.log('Current password valid:', isValid);
  
  if (!isValid) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed }
    });
    console.log('Password updated to admin123');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
