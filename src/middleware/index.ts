import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import jwt from "jsonwebtoken";
import * as userRepository from "../model/user";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt.secretKey as string, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const payload = decoded as jwt.JwtPayload;
    const user = await userRepository.getOneById(payload.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    res.locals.userId = user.id;
    next();
  });
};
