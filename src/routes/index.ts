import { Application } from "express";
import authRouter from "./authRouter";

export const router = (app: Application) => {
  app.use("/api/auth", authRouter);
};
