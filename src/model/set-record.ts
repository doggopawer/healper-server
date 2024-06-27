import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutRecord } from "./workout-record";

export const SetRecord = sequelize.define("SetRecord", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rep: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    restSec: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export async function getAll(workoutRecordId: number) {
    try {
        return await SetRecord.findAll({
            where: {
                workoutRecordId,
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}

type CreateSetRecordRequest = {
    order: number;
    weight: number;
    rep: number;
    restSec: number;
    workoutRecordId: string;
};
export async function createOne(
    createSetRecordRequest: CreateSetRecordRequest
) {
    try {
        const data = await SetRecord.create(createSetRecordRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}
