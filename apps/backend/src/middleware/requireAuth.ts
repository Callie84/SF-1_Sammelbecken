import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/auth';

declare global {
  namespace Express { interface Request { user?: JwtPayload } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers['authorization'];
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'auth_required' });
  try {
    const token = h.slice('Bearer '.length).trim();
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}