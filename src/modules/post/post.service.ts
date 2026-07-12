import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: IcreatePostPayload,
  userId: string,
) => {
  const createPost = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return createPost;
};

const getAllPostFromDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      comment: true,
    },
  });

  return result;
};

const getPostStatsFromDB = async () => {};

const getMyPostsFromDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      comment: true,
      author: {
        omit: {
          password: true,
        },
      },

      _count: {
        select: {
          comment: true,
        },
      },
    },
  });
    return result
};

const getPostByIdFromDB = async (postId: string) => {
  const updatePost = await prisma.post.update({
    where: { id: postId },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comment: true,
    },
  });
  return updatePost;
};

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
