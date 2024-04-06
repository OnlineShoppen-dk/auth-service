import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../env/config";
import { generateToken } from "../utils/jwt";


export interface UserRequest extends Request {
  user?: JwtPayload;
  user_guid?: string;
}
const secret = JWT_SECRET_KEY as string;


export const verifyAccessToken = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).send({ error: "Unauthorized: Token missing" });
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    req.user_guid = decoded.data;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Unauthorized: Invalid token" });
  }
}

export const generateRefreshToken = async (req: UserRequest, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const decoded = jwt.verify(refreshToken, secret) as JwtPayload;
    const accessToken = generateToken(decoded.data, "10s");

    res.cookie("token", accessToken, { httpOnly: true, expires: new Date(Date.now() + 10 * 1000) });
    return res.status(200).send({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).send({ error: "Invalid or expired refresh token" });
  }
};
