import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import jwt from "jsonwebtoken";
import UserModel from "../model/user";
import { CustomError, ErrorDefinitions } from "../types/error";
import { handleError } from "../util";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.get("Authorization");
        if (!(authHeader && authHeader.startsWith("Bearer "))) {
            throw new CustomError(ErrorDefinitions.SESSION_EXPIRED);
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(
            token,
            config.jwt.secretKey as string,
            async (error, decoded) => {
                if (error) {
                    if (error.name === "TokenExpiredError") {
                        throw new CustomError(ErrorDefinitions.SESSION_EXPIRED);
                    } else if (error.name === "JsonWebTokenError") {
                        throw new CustomError(ErrorDefinitions.SESSION_EXPIRED);
                    }
                    throw new CustomError(ErrorDefinitions.SERVER_ERROR);
                }
                const payload = decoded as jwt.JwtPayload;
                const user = await UserModel.findById(payload.id);
                if (!user) {
                    throw new CustomError(ErrorDefinitions.NOT_FOUND);
                }
                res.locals.userId = user.id;
                next();
            }
        );
    } catch (e) {
        handleError(res, e);
    }
};
