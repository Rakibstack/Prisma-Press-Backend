import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { premiumController } from "./primium.controller";

const route = Router()

route.get('/',
    auth(Role.ADMIN,Role.USER),
    premiumController.getPremiumContent
)




export const premiumRoute = route