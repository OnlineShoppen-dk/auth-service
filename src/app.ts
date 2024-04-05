import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import init from "./routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

init(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
