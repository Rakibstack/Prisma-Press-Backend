import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router()

route.post('/',auth(Role.ADMIN,Role.AUTHOR,Role.USER),postController.createPost);
route.get('/',postController.getAllPost);
route.get('/stats',auth(Role.ADMIN),postController.getPostStats);
route.get('/my-posts',auth(Role.ADMIN,Role.USER,Role.AUTHOR),postController.getMyPosts);
route.get('/:postId',postController.getPostById);
route.patch('/:postId',auth(Role.ADMIN,Role.USER,Role.AUTHOR),postController.updatePost)
route.delete('/:postId',auth(Role.ADMIN,Role.USER,Role.AUTHOR),postController.deletePost)




export const postRoutes = route