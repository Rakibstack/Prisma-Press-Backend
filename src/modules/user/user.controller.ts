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
    const { accessToken, refreshToken } = req.cookies;
    const verifyToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    if(typeof verifyToken === "string"){
      throw new Error("verifyedToken")
    }

    const userProfile = await userService.getMyProfileFromDB(verifyToken.id)
    sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: 'User Profile Fetched Successfully',
      data: {userProfile}
    })
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
