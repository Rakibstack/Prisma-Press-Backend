import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IpostQuery } from "../post/post.interface";

const getPremiumContent = async (query: IpostQuery) => {
  const limit = query.limit ? Number(query.limit) : 1;
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
  const totalPostCount = await prisma.post.count({
    where: {
      AND: addConditions,
    },
  });
  addConditions.push({
    isPremium: true,
  });

  const posts = await prisma.post.findMany({
    where: {
      AND: addConditions,
    },
    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return {
    data: posts,
    meta: {
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPage: Math.ceil(totalPostCount / limit),
    },
  };

};

export const premiumService = {
    getPremiumContent,
  };
