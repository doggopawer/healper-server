import { NextFunction, Request, Response } from "express";
import * as WorkoutConfigRepository from "../model/workout-config";

export const getWorkoutConfigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { routineConfigId } = req.params;
    const data = await WorkoutConfigRepository.getAll(
      parseInt(routineConfigId)
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const createWorkoutConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, workoutImage, type, routineConfigId } = req.body;

    const newWorkoutConfig = await WorkoutConfigRepository.createOne({
      name,
      workoutImage,
      type,
      routineConfigId,
    });
    res.status(201).json(newWorkoutConfig);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const deleteWorkoutConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await WorkoutConfigRepository.deleteOne(parseInt(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
