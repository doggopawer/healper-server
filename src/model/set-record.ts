import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { SetRecord as SetRecordType } from "../types/set-record";

export const SetRecord = sequelize.define<Model<SetRecordType>>("SetRecord", {
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
    workoutRecordId: {
        // userId 속성 추가
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "workoutrecords",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
export async function createOne(createSetRecordRequest: any) {
    try {
        const data = await SetRecord.create(createSetRecordRequest);
        return data.dataValues;
    } catch (err) {
        throw new Error(err as string);
    }
}
