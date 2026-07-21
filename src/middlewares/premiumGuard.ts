import { NextFunction, Request, Response } from "express";
import { catchasync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

export const subscriptionGuard = () => {
  return catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const isSubscribed = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!isSubscribed) {
      throw new Error("Please Subscribe To Get Premium Content");
    }
    if (isSubscribed?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error("Please renew your subscription to get premium content");
    }

    next();
  });
};
