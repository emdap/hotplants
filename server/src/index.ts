import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { auth, serverURL, trustedOrigins } from "./auth";

const port = 4000;
const hostname = "0.0.0.0";

const app = express();

app.all(
  "/auth/*splat",
  cors({
    origin: trustedOrigins,
    credentials: true,
  }),
  toNodeHandler(auth)
);

app.use(
  "/graphql",
  createProxyMiddleware({
    target: `${serverURL}/graphql`,
    changeOrigin: true,
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: `${serverURL}/api`,
    changeOrigin: true,
  })
);

app.listen(port, hostname, async () => {
  console.info("auth listening", hostname, port);
});
