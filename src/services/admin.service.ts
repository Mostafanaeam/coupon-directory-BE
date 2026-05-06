import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (username: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) throw new Error('Invalid credentials');
  
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) throw new Error('Invalid credentials');
  
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() }
  });
  
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET || 'super_secret_dev_key',
    { expiresIn: '24h' }
  );
  
  return { success: true, token, username: admin.username };
};

export const getAdminById = async (id: number) => {
  return await prisma.admin.findUnique({
    where: { id },
    select: { id: true, username: true, lastLogin: true }
  });
};
