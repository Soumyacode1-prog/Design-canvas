import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
export const ACCESS_MS = 15 * 60 * 1000;
export const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
export const hashToken = (value) => createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("hex");
function derive(password, salt) {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }, (error, key) => {
            if (error)
                reject(error);
            else
                resolve(key);
        });
    });
}
export async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash)
        return false;
    const key = await derive(password, salt);
    const expected = Buffer.from(hash, "hex");
    return expected.length === key.length && timingSafeEqual(expected, key);
}
export function readCookie(req, name) {
    const value = req.headers.cookie?.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
    return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
function cookieOptions(path) {
    return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path };
}
export function setTokens(res, access, refresh, expiresAt) {
    res.cookie("access_token", access, { ...cookieOptions("/api"), maxAge: ACCESS_MS });
    res.cookie("refresh_token", refresh, { ...cookieOptions("/api/auth"), maxAge: Math.max(0, expiresAt.getTime() - Date.now()) });
}
export function clearTokens(res) {
    res.clearCookie("access_token", cookieOptions("/api"));
    res.clearCookie("refresh_token", cookieOptions("/api/auth"));
}
//# sourceMappingURL=security.js.map