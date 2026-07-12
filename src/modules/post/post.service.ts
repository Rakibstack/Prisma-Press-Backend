import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: IcreatePostPayload,
  userId: string,
) => {

  const createPost = await prisma.post.create({
    data: {
        ...payload,
       authorId: userId
    }
  })
  return createPost;
};

const getAllPostFromDB = async () => {

    const result = await prisma.post.findMany()
    return result;
};

const getPostStatsFromDB = async () => {};

const getMyPostsFromDB = async () => {};

const getPostByIdFromDB = async () => {};

const updatePostFromDB = async () => {};

const deletePostFromDB = async () => {};

export const postService = {
  createPostIntoDB,
  getAllPostFromDB,
  getPostStatsFromDB,
  getMyPostsFromDB,
  getPostByIdFromDB,
  updatePostFromDB,
  deletePostFromDB,
};
