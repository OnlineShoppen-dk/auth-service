import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  const word: string = "World";
  res.send(`Hello ${word}`);
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
