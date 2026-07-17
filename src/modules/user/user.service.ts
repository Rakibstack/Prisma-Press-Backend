import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;

  const userExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });
  

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto: profilePhoto,
  //   },
  // });
  const user = await prisma.user.findUnique({
    where: {
      email: createdUser.email,
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const updateProfileInDB = async (userId: string, payload: any) => {
  const { name, email, profilePhoto, bio } = payload;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updateUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateProfileInDB,
};
