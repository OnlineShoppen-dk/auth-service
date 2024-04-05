import { Router } from "express";
import { registerUser } from "../controller/authController";

const authRouter = Router();

authRouter.post("/register", registerUser);
export default authRouter;