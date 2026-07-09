import { NextFunction, Request,  Response } from "express";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { catchasync } from "../../utils/catchAsync";


const registerUser = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    res.status(httpstatus.CREATED).json({
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User registered successfully",
      data: {
        user: user,
      },
    });
  },
);

export const userController = {
  registerUser,
};
