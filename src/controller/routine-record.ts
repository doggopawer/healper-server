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

export const getRoutineConfigOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { userId } = res.locals;
        const data = await RoutineRecordRepository.getOneById(
            userId,
            parseInt(id)
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createRoutineRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, color } = req.body;
        const { userId } = res.locals;
        const newRoutineConfig = await RoutineRecordRepository.createOne({
            name,
            color,
            userId,
        });
        res.status(201).json(newRoutineConfig);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateRoutineRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const { userId } = res.locals;
        const newRoutineConfig = await RoutineRecordRepository.updateOne({
            id: parseInt(id),
            name,
            color,
            userId,
        });
        res.status(200).json(newRoutineConfig);
    } catch (error) {
        res.status(500).json(error);
    }
};
