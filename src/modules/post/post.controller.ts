import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createPost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await postService.createPostIntoDB(
      payload,
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Post Created Successfully",
      data: { result },
    });
  },
);
const getAllPost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const result = await postService.getAllPostFromDB(query);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Retrived All Post",
      data: { result },
    });
  },
);
const getPostStats = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {

     const result = await postService.getPostStatsFromDB()
     sendResponse(res,{
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Retrive All Post Status Successfully',
      data: result
     })
  },
);
const getMyPosts = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const result = await postService.getMyPostsFromDB(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Retrieve My Post Successfully",
      data: { result },
    });
  },
);
const getPostById = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params?.postId;
    if (!postId) {
      throw new Error("post id is required");
    }
    const result = await postService.getPostByIdFromDB(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Post Retrive Successfully",
      data: { result },
    });
  },
);
const updatePost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const payload = req.body;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!postId) {
      throw new Error("post id is required");
    }

    const result = await postService.updatePostFromDB(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Post Updated Successfully",
      data: { result },
    });
  },
);
const deletePost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!postId) {
      throw new Error("post id is required");
    }
    await postService.deletePostFromDB(
      postId as string,
      authorId as string,
      isAdmin,
    );
    sendResponse(res,{
      success : true,
      statusCode: HttpStatus.OK,
      message: 'post delete successfully',
      data: null,
    })
  },
);

export const postController = {
  createPost,
  getAllPost,
  getPostStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
