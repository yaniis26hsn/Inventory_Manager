import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
}