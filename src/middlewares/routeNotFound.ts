import { NextFunction, Request, Response } from "express";
import  httpstatus  from "http-status";

export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date(),
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: httpstatus.INTERNAL_SERVER_ERROR,
    message: err.message,
    error: err.stack
  });
};
