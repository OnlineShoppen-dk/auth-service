import { Router } from "express";
import { authCheck, checkCookies, login, registerUser } from "../controller/authController";
import {  generateRefreshToken, verifyAccessToken } from "../middleware/jwtMiddleware";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.get("/auth-check", [verifyAccessToken], authCheck);
authRouter.get("/cookies",checkCookies)
authRouter.post("/refresh-token", generateRefreshToken); 

export default authRouter;