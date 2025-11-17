import { Request, Response, NextFunction } from "express";


const SUPPORTED = ["de", "en"] as const;
export type Locale = typeof SUPPORTED[number];


export function localeMw(req: Request, _res: Response, next: NextFunction) {
let lang: string | undefined = undefined;
if (typeof req.query.lang === "string") lang = req.query.lang;
else if (typeof req.headers["x-sf1-lang"] === "string") lang = String(req.headers["x-sf1-lang"]);
else if (req.acceptsLanguages()) lang = req.acceptsLanguages(SUPPORTED as unknown as string[]) || undefined as any;
(req as any).locale = SUPPORTED.includes((lang as any)) ? lang : "de";
next();
}