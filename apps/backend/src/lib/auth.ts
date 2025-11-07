import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) { throw new Error('JWT_SECRET fehlt'); }

export type JwtPayload = { sub: string; roles: string[]; iat: number; exp: number };

export function signToken(userId: string, roles: string[], ttlSeconds = 60 * 60 * 24) {
  return jwt.sign({ sub: userId, roles }, JWT_SECRET, { algorithm: 'HS256', expiresIn: ttlSeconds });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
}