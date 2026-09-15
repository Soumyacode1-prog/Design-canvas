import { Router } from "express";
import { z } from "zod";
import { Session, User } from "./models.ts";
import { requireAuth, limitAuthAttempts } from "./middleware.ts";
import { ACCESS_MS, REFRESH_MS, clearTokens, hashPassword, hashToken, newToken, readCookie, setTokens, verifyPassword } from "./security.ts";

const router = Router();
router.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
const credentials = z.object({ email: z.string().trim().toLowerCase().max(254).pipe(z.email()), password: z.string().min(12).max(128) });
const signupSchema = credentials.extend({ name: z.string().trim().min(1).max(80) });
const publicUser = (user: { _id: unknown; name: string; email: string }) => ({ id: String(user._id), name: user.name, email: user.email });

router.post("/signup", limitAuthAttempts, async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: "Enter a name, valid email, and a password of 12–128 characters." }); return; }
    const { name, email, password } = parsed.data;
    const user = await User.create({ name, email, passwordHash: await hashPassword(password) });
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) { res.status(409).json({ message: "Unable to create account with this email. Try logging in." }); return; }
    next(error);
  }
});

router.post("/login", limitAuthAttempts, async (req, res, next) => {
  try {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) { res.status(401).json({ message: "Invalid email or password." }); return; }
    const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
    const valid = await verifyPassword(parsed.data.password, user?.passwordHash || `${"0".repeat(32)}:${"0".repeat(128)}`);
    if (!user || !valid) { res.status(401).json({ message: "Invalid email or password." }); return; }
    const access = newToken(), refresh = newToken();
    const expiresAt = new Date(Date.now() + REFRESH_MS);
    await Session.create({ user: user._id, accessHash: hashToken(access), refreshHash: hashToken(refresh), accessExpiresAt: new Date(Date.now() + ACCESS_MS), expiresAt });
    setTokens(res, access, refresh, expiresAt);
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = readCookie(req, "refresh_token");
    if (!token) { clearTokens(res); res.status(401).json({ message: "Please log in again." }); return; }
    const oldHash = hashToken(token), access = newToken(), refresh = newToken();
    const session = await Session.findOneAndUpdate(
      { refreshHash: oldHash, revoked: false, expiresAt: { $gt: new Date() } },
      { $set: { refreshHash: hashToken(refresh), accessHash: hashToken(access), accessExpiresAt: new Date(Date.now() + ACCESS_MS) }, $push: { usedRefreshHashes: oldHash } },
      { returnDocument: "after" },
    );
    if (!session) {
      await Session.updateMany({ usedRefreshHashes: oldHash, revoked: false }, { $set: { revoked: true } });
      clearTokens(res); res.status(401).json({ message: "Session expired. Please log in again." }); return;
    }
    setTokens(res, access, refresh, session.expiresAt);
    res.json({ message: "Session refreshed." });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, async (_req, res, next) => {
  try {
    const user = await User.findById(res.locals.userId);
    if (!user) { clearTokens(res); res.status(401).json({ message: "Please log in." }); return; }
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/logout", async (req, res, next) => {
  try {
    const refresh = readCookie(req, "refresh_token"), access = readCookie(req, "access_token");
    const matches = [];
    if (refresh) matches.push({ refreshHash: hashToken(refresh) }, { usedRefreshHashes: hashToken(refresh) });
    if (access) matches.push({ accessHash: hashToken(access) });
    if (matches.length) await Session.updateMany({ $or: matches }, { $set: { revoked: true } });
    clearTokens(res); res.status(204).send();
  } catch (error) { next(error); }
});
export default router;
