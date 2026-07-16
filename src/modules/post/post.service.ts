import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  IcreatePostPayload,
  IpostQuery,
  IupdatePostPayload,
} from "./post.interface";

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

const getAllPostFromDB = async (query: IpostQuery) => {

  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  const addConditions: PostWhereInput[] = [];
  

  if (query.searchTerm) {
    addConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (query.title) {
    addConditions.push({
      title: query.title,
    });
  }
  if (query.content) {
    addConditions.push({
      content: query.content,
    });
  }

  if (query.tags) {
    addConditions.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }

  const result = await prisma.post.findMany({
    where: {
      AND: addConditions,
    },
    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return result;
};

const getPostStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (prismaTx) => {
    const [
      totalposts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViews,
    ] = await Promise.all([
      await prismaTx.post.count(),
      await prismaTx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await prismaTx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await prismaTx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await prismaTx.comment.count(),
      await prismaTx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await prismaTx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await prismaTx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalposts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViews: totalViews._sum.views,
    };
  });

  return transactionResult;
};

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
  return result;
};

const getPostByIdFromDB = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findUniqueOrThrow({
      where: { id: postId },
      include: {
        author: {
          omit: { password: true },
        },
        comment: {
          where: {
            status: CommentStatus.APPROVED,
          },
        },
        _count: {
          select: {
            comment: true,
          },
        },
      },
    });
    return post;
  });

  return transactionResult;
};

const updatePostFromDB = async (
  postId: string,
  payload: IupdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not the owner of this post");
  }
  const updatePost = await prisma.post.update({
    where: { id: postId },
    data: payload,
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

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not the owner of this post");
  }
  await prisma.post.delete({
    where: { id: postId },
  });
};

export const postService = {
  createPostIntoDB,
  getAllPostFromDB,
  getPostStatsFromDB,
  getMyPostsFromDB,
  getPostByIdFromDB,
  updatePostFromDB,
  deletePostFromDB,
};
