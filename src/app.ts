import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import httpstatus from "http-status";

const app: Application = express();

app.use(
  cors({
    origin: config.app_Url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto: profilePhoto,
    },
  });
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

  res.status(httpstatus.CREATED).json({
    success: true,
    statusCode: httpstatus.CREATED,
    message: "User registered successfully",
    data: {
      user: user,
    },
  });
});

export default app;
