import { NextFunction } from "express";
import { Request, Response } from "express";
import httpstatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

    let statusCode;
    let errorMessage = err.message || 'Internal Server Error';
    let errorName = err.name || 'Internal Server Error';

    if( err instanceof Prisma.PrismaClientValidationError){
      statusCode = httpstatus.BAD_REQUEST,
      errorMessage = 'you have provided incorrect field type or missing fields'
     } else if (err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === 'P2002'){
            statusCode = httpstatus.BAD_REQUEST,
            errorMessage = 'Duplicate Key Error'
        }else if (err.code === 'P2003'){
            statusCode = httpstatus.BAD_REQUEST,
            errorMessage = "Foreign Key Constraint Failed"
        }
     }

  res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpstatus.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: err.stack,
  });
};
