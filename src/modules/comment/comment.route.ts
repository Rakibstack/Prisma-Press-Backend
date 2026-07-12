import { Router } from "express";
import { commentController } from "./comment.controller";

const route = Router()

 route.post('/',commentController.createComment) 




export const commentRoutes = route