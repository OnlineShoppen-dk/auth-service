import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

app.listen(8080, () => console.log("Server is running on port 8080"));
