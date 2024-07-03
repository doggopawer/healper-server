import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { WorkoutRecord as WorkoutRecordType } from "../types/workout-record";

export const WorkoutRecord = sequelize.define<Model<WorkoutRecordType>>(
    "WorkoutRecord",
    {
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        routineRecordId: {
            // userId 속성 추가
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "routinerecords",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    }
);

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

type CreateWorkoutRecordRequest = {
    name: string;
    workoutImage: string;
    type: string;
    routineRecordId: string;
};
export async function createOne(createWorkoutConfigRequest: any) {
    try {
        const data = await WorkoutRecord.create(createWorkoutConfigRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}
export async function deleteOne(id: number) {
    try {
        const data = await WorkoutRecord.destroy({
            where: {
                id,
            },
        });
        return data;
    } catch (err) {
        throw new Error(err as string);
    }
}
