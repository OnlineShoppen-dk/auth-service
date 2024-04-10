import express from "express";
import "dotenv/config";
import init from "./bootstrap/init";

const app = express();

init(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
