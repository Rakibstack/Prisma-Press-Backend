import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from "http-status";


  const loginUser = catchasync(async (req : Request,res :Response,next:NextFunction) => {

    const payload = req.body
    const result = await authService.loginUserIntoDB(payload)
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message: 'User Login Successfull',
        data: result
    })

  })





  export const authController = {
    loginUser
  }