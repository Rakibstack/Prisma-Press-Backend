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
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
