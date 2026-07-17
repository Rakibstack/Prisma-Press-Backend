import { NextFunction, Request, Response } from "express";
import  httpstatus  from "http-status";

export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date(),
  });
};


