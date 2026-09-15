import type { Request, Response } from "express";
export declare const ACCESS_MS: number;
export declare const REFRESH_MS: number;
export declare const hashToken: (value: string) => string;
export declare const newToken: () => string;
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, stored: string): Promise<boolean>;
export declare function readCookie(req: Request, name: string): string | null;
export declare function setTokens(res: Response, access: string, refresh: string, expiresAt: Date): void;
export declare function clearTokens(res: Response): void;
//# sourceMappingURL=security.d.ts.map