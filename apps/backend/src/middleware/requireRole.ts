import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles || [];
    const ok = roles.some(r => userRoles.includes(r));
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}