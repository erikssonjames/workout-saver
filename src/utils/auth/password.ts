import { compare, hash } from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword: string = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password: string | null, hashedPassword: string | null): Promise<boolean> {
  if(!hashedPassword || !password) return false;
  const isValid: boolean = await compare(password, hashedPassword);
  return isValid;
}