const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdmin() {
  const admin = await prisma.admin.findFirst();
  if (!admin) {
    console.log('No admin found, creating one...');
    const password = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.admin.create({
      data: { username: 'admin', password }
    });
    console.log('Created admin:', newAdmin.username);
  } else {
    console.log('Admin exists:', admin.username);
    const isValid = await bcrypt.compare('admin123', admin.password);
    console.log('Password admin123 valid:', isValid);
  }
  await prisma.$disconnect();
}

checkAdmin().catch(e => console.error(e));
