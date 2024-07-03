import { DataTypes, Model, Op } from "sequelize";
import { sequelize } from "../db";
import { RoutineRecord as RoutineRecordType } from "../types/routine-record";

export const RoutineRecord = sequelize.define<Model<RoutineRecordType>>(
    "RoutineRecord",
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
        color: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        workoutSec: {
            type: DataTypes.INTEGER,
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

export async function getAll(userId: number, createdAt: string) {
    try {
        const date = new Date(createdAt);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        return await RoutineRecord.findAll({
            where: {
                userId,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}

export async function getOneById(userId: number, id: number) {
    try {
        return await RoutineRecord.findOne({
            where: {
                userId, // 해당유저의
                id, // routineId값이 일치하는 routine을 가져온다.
            },
        });
    } catch (err) {
        throw new Error(err as string); // err가 Error 타입임을 가정
    }
}

type CreateRoutineRecordRequest = {
    name: string;
    color: string;
    workoutSec: number;
    userId: number;
};
export async function createOne(CreateRoutineConfigRequest: any) {
    try {
        const data = await RoutineRecord.create(CreateRoutineConfigRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}

type UpdateRoutineRecordRequest = {
    id: number;
    name: string;
    color: string;
    userId: number;
};
export async function updateOne(
    updateRoutineConfigRequest: UpdateRoutineRecordRequest
) {
    const { name, color, id } = updateRoutineConfigRequest;
    try {
        const data = await RoutineRecord.findByPk(id);

        if (!data) {
            throw new Error("not found");
        }

        data.set({
            name,
            color,
        });
        await data.save();

        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}

export async function deleteOne(id: number) {
    try {
        const data = await RoutineRecord.destroy({
            where: {
                id,
            },
        });
        return data;
    } catch (err) {
        throw new Error(err as string);
    }
}
