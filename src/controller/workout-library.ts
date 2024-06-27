import { NextFunction, Request, Response } from "express";
import * as WorkoutLibraryRepository from "../model/workout-library";

export const getWorkoutLibraryAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = res.locals;
        const { workoutPart } = req.query;
        const data = await WorkoutLibraryRepository.getAll(
            userId,
            workoutPart as string
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export const createWorkoutLibraryOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, workoutImage, workoutPart, type } = req.body;
        const { userId } = res.locals;
        const newWorkoutLibrary = await WorkoutLibraryRepository.createOne({
            name,
            workoutImage,
            workoutPart,
            type,
            userId,
        });
        res.status(201).json(newWorkoutLibrary);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateWorkoutLibraryOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, workoutImage, workoutPart, type } = req.body;
        // const { userId } = res.locals;
        const newWorkoutLibrary = await WorkoutLibraryRepository.updateOne({
            id: parseInt(id),
            name,
            workoutImage,
            workoutPart,
            type,
        });
        res.status(200).json(newWorkoutLibrary);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteWorkoutLibraryOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const newWorkoutLibrary = await WorkoutLibraryRepository.deleteOne(
            parseInt(id)
        );
        res.status(200).json(newWorkoutLibrary);
    } catch (error) {
        res.status(500).json(error);
    }
};
