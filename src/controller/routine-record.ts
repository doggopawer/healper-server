import { NextFunction, Request, Response } from "express";
import * as RoutineRecordRepository from "../model/routine-record";

export const getRoutineRecordAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = res.locals;
        const data = await RoutineRecordRepository.getAll(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};
