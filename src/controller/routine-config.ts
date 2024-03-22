import { NextFunction, Request, Response } from "express";
import * as RoutineConfigRepository from "../model/routine-config";

export async function getAllRoutineConfigs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = await RoutineConfigRepository.getAll(1);

  res.status(200).json(data);
}

export async function createRoutineConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, color } = req.body;
    const { userId } = res.locals;
    const newRoutineConfig = await RoutineConfigRepository.createOne({
      name,
      color,
      userId,
    });
    res.status(201).json(newRoutineConfig);
  } catch (err) {}
}
