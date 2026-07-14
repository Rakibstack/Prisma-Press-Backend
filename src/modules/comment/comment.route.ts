import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment);
route.get('/author/:authorId',commentController.getCommentByAuthorId)
route.get('/:commentId',commentController.getCommentByCommentID)
route.patch('/:commentId',auth(Role.ADMIN,Role.USER),commentController.updateComment)
route.delete('/:commentId',auth(Role.ADMIN,Role.USER),commentController.deleteComment)

export const commentRoutes = route;
