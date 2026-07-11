import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { catchasync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwtUtils";

const registerUser = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User Register Successfully",
      data: user,
    });
  },
);

const getMyProfile = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const userProfile = await userService.getMyProfileFromDB(
      user?.id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Profile Fetched Successfully",
      data: { userProfile },
    });
  },
);

const updateMyProfile = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const updateProfile = await userService.updateProfileInDB(userId, payload);
    sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: 'User Update Successfully',
      data: updateProfile
    })

  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
