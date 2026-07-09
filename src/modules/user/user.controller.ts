import { NextFunction, Request,  Response } from "express";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { catchasync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const registerUser = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

   sendResponse(res,{
    success: true,
    statusCode: httpstatus.CREATED,
    message:'User Register Successfully',
    data: user
   })
  },
);

export const userController = {
  registerUser,
};
