import { prisma } from "../../lib/prisma";
import { IcreateCommentPayload } from "./comment.interface";

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
  return createComment
};

const getCommentByAuthorIdIntoDB = () => {};
const getCommentByCommentIDIntoDB = () => {};
const updateCommentIntoDB = () => {};
const deleteCommentIntoDB = () => {};

export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorIdIntoDB,
  getCommentByCommentIDIntoDB,
  updateCommentIntoDB,
  deleteCommentIntoDB,
};
