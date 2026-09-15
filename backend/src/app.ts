import express from "express";
import cors from "cors";

import authRoutes from "./auth/routes.ts";
import { checkOrigin, requireAuth } from "./auth/middleware.ts";

import canvasRoutes from "./routes/canvas.routes.ts";

import { notFound } from "./middleware/notFound.middleware.ts";
import { errorHandler } from "./middleware/error.middleware.ts";

const app = express();

app.use(
  cors({
    credentials: true,
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:3000",
  })
);

app.use(
  express.json({
    limit: "2mb",
  })
);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use("/api", checkOrigin);
app.use("/api/auth", authRoutes);
app.use("/api/canvases", requireAuth, (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
}, canvasRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;