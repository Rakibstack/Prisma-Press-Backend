import { prisma } from "../../lib/prisma";
import { IcreateCommentPayload, IupdateComment } from "./comment.interface";

const createCommentIntoDB = async (
  authorId: string,
  payload: IcreateCommentPayload,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  const createComment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });
  return createComment;
};

const getCommentByAuthorIdIntoDB = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};
const getCommentByCommentIDIntoDB = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return result;
};
const updateCommentIntoDB = async (
  commentId: string,
  authorId: string,
  data: IupdateComment,
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
  return result;
};
const deleteCommentIntoDB = async (authorId: string, commentId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  const deleteComment = await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });
  return deleteComment;
};

export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorIdIntoDB,
  getCommentByCommentIDIntoDB,
  updateCommentIntoDB,
  deleteCommentIntoDB,
};
