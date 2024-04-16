import { Application } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const middlewares = (app: Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(
    ["/api/auth/login", "/api/auth/register"],
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 30,
    })
  );

  app.use(
    ["/api/auth/login", "/api/auth/register"],
    slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 100,
    })
  );
};

export default middlewares;
