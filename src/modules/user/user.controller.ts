import { Request, Response } from "express";

import httpstatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const user = await userService.registerUserIntoDB(payload);
    res.status(httpstatus.CREATED).json({
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User registered successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpstatus.INTERNAL_SERVER_ERROR,
      message: "Failed to Register User",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
