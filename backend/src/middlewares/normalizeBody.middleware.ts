import type { NextFunction, Request, Response } from "express";

export function normalizeBody(req: Request, _res: Response, next: NextFunction) {
  req.body ??= {};
  next();
}
