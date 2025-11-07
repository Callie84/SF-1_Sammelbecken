import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload { uid: string; roles: string[]; }

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.slice(7) : "");
    if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
};

export const requireRole = (role: string) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as JwtPayload | undefined;
  if (!user || !user.roles?.includes(role)) return res.status(403).json({ error: "FORBIDDEN" });
  next();
};