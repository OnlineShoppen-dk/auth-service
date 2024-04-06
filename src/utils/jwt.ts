import jwt from 'jsonwebtoken';
import "dotenv/config";
import { JWT_SECRET_KEY } from '../env/config';


const secretKey = JWT_SECRET_KEY as string;

export function generateToken(payload: string, expiresIn: string): string {
  return jwt.sign({data: payload}, secretKey, { expiresIn });
}
