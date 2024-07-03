import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { WorkoutLibrary as WorkoutLibraryType } from "../types/workout-library";

export const WorkoutLibrary = sequelize.define<Model<WorkoutLibraryType>>(
    "WorkoutLibrary",
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
        workoutPart: {
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
        userId: {
            // userId 속성 추가
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    }
);

export async function getAll(userId: number, workoutPart: string) {
    try {
        return await WorkoutLibrary.findAll({
            where: {
                userId,
                workoutPart,
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}

type CreateWorkoutRecordRequest = {
    name: string;
    workoutImage: string;
    workoutPart: string;
    type: string;
    userId: number;
};
export async function createOne(createWorkoutLibraryRequest: any) {
    try {
        const data = await WorkoutLibrary.create(createWorkoutLibraryRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}

type UpdateWorkoutLibraryRequest = {
    id: number;
    name: string;
    workoutImage: string;
    workoutPart: string;
    type: string;
};
export async function updateOne(
    updateWorkoutLibraryRequest: UpdateWorkoutLibraryRequest
) {
    const { id, name, workoutImage, workoutPart, type } =
        updateWorkoutLibraryRequest;
    try {
        const data = await WorkoutLibrary.findByPk(id);

        if (!data) {
            throw new Error("not found");
        }

        data.set({
            name,
            workoutImage,
            workoutPart,
            type,
        });
        await data.save();

        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}

export async function deleteOne(id: number) {
    try {
        const data = await WorkoutLibrary.destroy({
            where: {
                id,
            },
        });
        return data;
    } catch (err) {
        throw new Error(err as string);
    }
}
