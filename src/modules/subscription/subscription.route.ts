import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionController } from "./subscription.controller";

const route = Router()

route.post('/checkout',
    auth(Role.ADMIN,Role.USER),
    subscriptionController.createCheckoutSession
)



export const subscriptionRoutes = route