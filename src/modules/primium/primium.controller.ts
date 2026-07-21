import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { premiumService } from "./primium.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

const getPremiumContent = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await premiumService.getPremiumContent(query);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Get Primium Content Successfully",
      data:result.data,
      meta: result.meta
    });
  },
);

export const premiumController = {
  getPremiumContent,
};
