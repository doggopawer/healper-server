import { NextFunction, Request, Response } from "express";
import * as RoutineConfigRepository from "../model/routine-config";

export const getRoutineConfigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals;
    const data = await RoutineConfigRepository.getAll(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getRoutineConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = res.locals;
    const data = await RoutineConfigRepository.getOneById(userId, parseInt(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createRoutineConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, color } = req.body;
    const { userId } = res.locals;
    const newRoutineConfig = await RoutineConfigRepository.createOne({
      name,
      color,
      userId,
    });
    res.status(201).json(newRoutineConfig);
  } catch (error) {
    res.status(500).json({ error });
  }
};
