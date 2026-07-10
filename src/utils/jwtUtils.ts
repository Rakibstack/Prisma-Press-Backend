import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expirein: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expirein,
  } as SignOptions);
  return token;
};
const verifyToken = (access: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(access, secret);
    return verifiedToken;
  } catch (error : any) {
    throw new Error("invalid Token");
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
