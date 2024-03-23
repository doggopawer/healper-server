import { NextFunction, Request, Response } from "express";
import * as SetConfigRepository from "../model/set-config";

export const getSetConfigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workoutConfigId } = req.params;
    const data = await SetConfigRepository.getAll(parseInt(workoutConfigId));
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const createSetConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { order, weight, rep, restSec, workoutConfigId } = req.body;

    const newSetConfig = await SetConfigRepository.createOne({
      order,
      weight,
      rep,
      restSec,
      workoutConfigId,
    });
    res.status(201).json(newSetConfig);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const deleteSetConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await SetConfigRepository.deleteOne(parseInt(id));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
