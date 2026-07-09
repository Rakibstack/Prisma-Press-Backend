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

export const jwtUtils = {
  createToken,
};
