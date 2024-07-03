import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig as WorkoutConfigType } from "../types/workout-config";

export const WorkoutConfig = sequelize.define<Model<WorkoutConfigType>>(
    "WorkoutConfig",
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
        routineConfigId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "routineconfigs",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    }
);

export async function getAll(routineConfigId: number) {
    try {
        return await WorkoutConfig.findAll({
            where: {
                routineConfigId,
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}

type CreateWorkoutConfigRequest = {
    name: string;
    workoutImage: string;
    type: string;
    routineConfigId: string;
};
export async function createOne(createWorkoutConfigRequest: any) {
    try {
        const data = await WorkoutConfig.create(createWorkoutConfigRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}

export async function deleteOne(id: number) {
    try {
        const data = await WorkoutConfig.destroy({
            where: {
                id,
            },
        });
        return data;
    } catch (err) {
        throw new Error(err as string);
    }
}
