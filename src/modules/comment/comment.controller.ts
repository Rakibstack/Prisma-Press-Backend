import { NextFunction, Request, Response } from "express";
import { catchasync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import strict from "node:assert/strict";

const createComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await commentService.createCommentIntoDB(
      authorId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Comment Created Successfully",
      data: result,
    });
  },
);
const getCommentByAuthorId = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    const result = await commentService.getCommentByAuthorIdIntoDB(
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Retrieve All Author Comment Successfully",
      data: result,
    });
  },
);
const getCommentByCommentID = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const result = await commentService.getCommentByCommentIDIntoDB(
      commentId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "get single comment successfully",
      data: result,
    });
  },
);
const updateComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const commentId = req.params.commentId;
    const payload = req.body;

    const result = await commentService.updateCommentIntoDB(
      commentId as string,
      authorId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "comment update successfully",
      data: result,
    });
  },
);
const deleteComment = catchasync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const authorId = req.user?.id;

    const result = await commentService.deleteCommentIntoDB(
      authorId as string,
      commentId as string,
    );
    sendResponse(res,{
        success: true,
        statusCode: HttpStatus.OK,
        message: " comment delete successfully ",
        data: result
    })
  },
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentID,
  updateComment,
  deleteComment,
};
