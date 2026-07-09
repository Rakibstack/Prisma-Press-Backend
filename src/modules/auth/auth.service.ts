import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { Ilogin } from "./auth.interface";

const loginUserIntoDB = async (payload:Ilogin) => {

    const {email,password } = payload

    const userExists = await prisma.user.findUniqueOrThrow({
        where: {
            email: email
        }
    })

    const matchedPassword = await bcrypt.compare(password,userExists.password)

    if(!matchedPassword){
        throw new Error('invalid credentials')
    }

     const user = await prisma.user.findUnique({
        where: {
            email: email
        }
     })

     return user
    
};



export const authService = {
    loginUserIntoDB
}
