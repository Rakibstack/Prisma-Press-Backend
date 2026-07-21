import { prisma } from "../../lib/prisma";

const getPremiumContent = async () => {
  const ressult = await prisma.post.findMany({
    where: {
      isPremium: true,
    },
    orderBy: {
        createdAt: "desc"
    }
  });
  return ressult;
};

export const premiumService = {
  getPremiumContent,
};
