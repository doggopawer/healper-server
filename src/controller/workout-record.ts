import { NextFunction, Request, Response } from "express";
import * as WorkoutRecordRepository from "../model/workout-record";

export const getWorkoutRecordAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { routineRecordId } = req.params;
        const data = await WorkoutRecordRepository.getAll(
            parseInt(routineRecordId)
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
