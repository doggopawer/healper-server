import jwt from "jsonwebtoken";
import { config } from "../config";
import { MongooseError } from "mongoose";
import { CustomError, ErrorDefinitions } from "../types/error";
import { Response } from "express";
import { AxiosError } from "axios";

export const createJwtToken = (id: string, oauthToken:string, clientId?:string, clientSecret?:string) => {
    return jwt.sign({ id, oauthToken, clientId, clientSecret }, config.jwt.secretKey as string, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const handleError = (res: Response, e: any) => {
    if (e instanceof CustomError) {
        return res.status(e.status).json({
            message: e.message,
            code: e.code,
            status: e.status,
        });
    } else if (e instanceof MongooseError) {
        return res.status(ErrorDefinitions.DB_ERROR.status).json({
            message: ErrorDefinitions.DB_ERROR.message,
            code: ErrorDefinitions.DB_ERROR.code,
            status: ErrorDefinitions.DB_ERROR.status,
        });
    } else if (e instanceof AxiosError) {
        return res.status(ErrorDefinitions.AXIOS_ERROR.status).json({
            message: ErrorDefinitions.AXIOS_ERROR.message,
            code: ErrorDefinitions.AXIOS_ERROR.code,
            status: ErrorDefinitions.AXIOS_ERROR.status,
        });
    }
};
