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
export const createWorkoutRecordOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, workoutImage, type, routineRecordId } = req.body;

        const newWorkoutRecord = await WorkoutRecordRepository.createOne({
            name,
            workoutImage,
            type,
            routineRecordId,
        });
        res.status(201).json(newWorkoutRecord);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export const deleteWorkoutRecordOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const data = await WorkoutRecordRepository.deleteOne(parseInt(id));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
};
