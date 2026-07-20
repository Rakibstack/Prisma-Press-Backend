import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionController } from "./subscription.controller";

const route = Router()

route.post('/checkout',
    auth(Role.ADMIN,Role.USER),
    subscriptionController.createCheckoutSession
)

route.post('/webhook',subscriptionController.handleWebhook)
route.get('/status',
    auth(Role.ADMIN,Role.USER),
    subscriptionController.getSubscriptionStatus
)



export const subscriptionRoutes = route