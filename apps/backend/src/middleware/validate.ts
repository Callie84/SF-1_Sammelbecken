import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    return next();
  } catch (err: any) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: err.errors ?? String(err) });
  }
};