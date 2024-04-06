import { Router } from "express";
import { authCheck, checkCookies, login, logout, registerUser } from "../controller/authController";
import { generateRefreshToken, verifyAccessToken, verifyLogout } from "../middleware/jwtMiddleware";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.get("/auth-check", [verifyAccessToken], authCheck);
authRouter.get("/cookies",checkCookies)
authRouter.post("/refresh-token", generateRefreshToken); 
authRouter.post("/logout",[verifyLogout],logout);

export default authRouter;