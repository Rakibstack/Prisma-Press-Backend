import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IcreatePostPayload, IupdatePostPayload } from "./post.interface";

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
