import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { auth, trustedOrigins } from "./auth";

const port = 4000;
const hostname = "0.0.0.0";

const app = express();
app.use(
  cors({
    origin: trustedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.listen(port, hostname, async () => {
  console.info("auth listening", hostname, port);
});
