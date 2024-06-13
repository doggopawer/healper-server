import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const RoutineRecord = sequelize.define("RoutineRecord", {
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
});

export async function getAll(userId: number) {
    try {
        return await RoutineRecord.findAll({
            where: {
                userId,
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
    userId: number;
};
export async function createOne(
    CreateRoutineConfigRequest: CreateRoutineRecordRequest
) {
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
