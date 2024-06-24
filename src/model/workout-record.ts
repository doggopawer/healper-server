import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const WorkoutRecord = sequelize.define("WorkoutRecord", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    workoutImage: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

export async function getAll(routineRecordId: number) {
    try {
        return await WorkoutRecord.findAll({
            where: {
                routineRecordId,
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}
