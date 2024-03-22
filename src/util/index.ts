import jwt from "jsonwebtoken";
import { config } from "../config";

export const createJwtToken = (id: string) => {
  return jwt.sign({ id }, config.jwt.secretKey as string, {
    expiresIn: config.jwt.expiresIn,
  });
};
