import type { RequestHandler } from "express";
import { AuthAttempt, Session } from "./models.ts";
import { hashToken, readCookie } from "./security.ts";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = readCookie(req, "access_token");
    const session = token && await Session.findOne({ accessHash: hashToken(token), revoked: false, accessExpiresAt: { $gt: new Date() }, expiresAt: { $gt: new Date() } });
    if (!session) { res.status(401).json({ message: "Please log in." }); return; }
    res.locals.userId = session.user.toString();
    next();
  } catch (error) { next(error); }
};

export const checkOrigin: RequestHandler = (req, res, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.get("origin") !== (process.env.CLIENT_URL || "http://localhost:3000")) {
    res.status(403).json({ message: "Request origin is not allowed." }); return;
  }
  next();
};

export const limitAuthAttempts: RequestHandler = async (req, res, next) => {
  try {
    const windowMs = 15 * 60 * 1000;
    const bucket = Math.floor(Date.now() / windowMs);
    const attempt = await AuthAttempt.findOneAndUpdate(
      { _id: hashToken(`${req.ip}:${bucket}`) },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) } },
      { upsert: true, returnDocument: "after" },
    );
    if (attempt.count > 30) {
      res.setHeader("Retry-After", Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000));
      res.status(429).json({ message: "Too many attempts. Please try again later." }); return;
    }
    next();
  } catch (error) { next(error); }
};
