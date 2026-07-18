import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

const createCheckoutSession = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Checkout Completed Successfully",
      data: result,
    });
  },
);

export const subscriptionController = {
  createCheckoutSession,
};
