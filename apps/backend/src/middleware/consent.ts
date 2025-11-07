import { Request, Response, NextFunction } from "express";

/** Platzhalter: gibt nur weiter. */
export default function consent(req: Request, res: Response, next: NextFunction) {
  next();
}
