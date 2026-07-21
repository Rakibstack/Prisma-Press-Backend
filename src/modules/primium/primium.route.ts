import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { premiumController } from "./primium.controller";
import { catchasync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/premiumGuard";

const route = Router();

route.get(
  "/",
  auth(Role.ADMIN, Role.USER),
  subscriptionGuard(),
  premiumController.getPremiumContent,
);

export const premiumRoute = route;
