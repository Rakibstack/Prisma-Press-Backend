import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus  from "http-status";

const createComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await commentService.createCommentIntoDB(
      authorId as string,
      payload,
    );
    sendResponse(res,{
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Comment Created Successfully',
        data : result
    })
  },
);
const getCommentByAuthorId = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCommentByCommentID = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentID,
  updateComment,
  deleteComment,
};
