import "dotenv/config";
export const PORT = process.env.PORT || 8080
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const DATABASE_URL = process.env.DATABASE_URL