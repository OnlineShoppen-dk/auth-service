import jwt from 'jsonwebtoken';
import "dotenv/config";

const secretKey = process.env.JWT_SECRET_KEY as string;

export function generateToken(payload: string): string {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, secretKey) as string;
    return decoded;
  } catch (error) {
    return null;
  }
}
