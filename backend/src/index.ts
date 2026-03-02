import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import router from "./routes/Router";
import { registerExpiringBillsJob } from "./jobs/expiringBills.jobs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, "http://localhost:5173"]
      : ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(router);

registerExpiringBillsJob();

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
