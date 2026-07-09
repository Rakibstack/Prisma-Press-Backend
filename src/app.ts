import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoute } from "./modules/user/user.route";
import { authroute } from "./modules/auth/auth.route";

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

app.use("/api/users",userRoute);
app.use('/api/auth',authroute);

export default app;
