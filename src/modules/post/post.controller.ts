import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import  HttpStatus  from "http-status";

const createPost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const getAllPost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const getPostStats = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const getMyPosts = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const getPostById = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const updatePost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);
 const deletePost = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
     
  },
);


export const postController = {
  createPost,
  getAllPost,
  getPostStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost
};
