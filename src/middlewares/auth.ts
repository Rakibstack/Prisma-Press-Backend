import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchasync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwtUtils";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requeredRole: Role[]) => {
  return catchasync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;     
        
        if (!token) {
            throw new Error(
                "you are not logged in. please log in to access this resource",
            );
        }     
        const verifyedToken = jwtUtils.verifyToken(token,config.jwt_access_secret);
        
        if(!verifyedToken){
            throw new Error("invalied credentials")
        }

       const {id,name,email,role} = verifyedToken as JwtPayload

       if(requeredRole.length && !requeredRole.includes(role)){
        throw new Error('Forbidden Access.you dont have permission to access this resource.')
       }

        const user =await prisma.user.findUniqueOrThrow({
            where: {
                id,
                name,
                email,
                role
            }
        })
        if(!user){
         throw new Error("user not found.please login again")
        }
        

    });
};
