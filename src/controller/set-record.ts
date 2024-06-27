import { NextFunction, Request, Response } from "express";
import * as SetRecordRepository from "../model/set-record";

export const getSetRecordAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { workoutRecordId } = req.params;
        const data = await SetRecordRepository.getAll(
            parseInt(workoutRecordId)
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export const createSetRecordOne = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { order, weight, rep, restSec, workoutRecordId } = req.body;

        const newSetRecord = await SetRecordRepository.createOne({
            order,
            weight,
            rep,
            restSec,
            workoutRecordId,
        });
        res.status(201).json(newSetRecord);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
