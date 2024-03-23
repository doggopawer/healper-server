import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const SetConfig = sequelize.define("SetConfig", {
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

export async function getAll(workoutConfigId: number) {
  try {
    return await SetConfig.findAll({
      where: {
        workoutConfigId,
      },
    });
  } catch (err) {
    throw new Error(err as string); // err가 Error 타입임을 가정
  }
}

type CreateSetConfigRequest = {
  order: number;
  weight: number;
  rep: number;
  restSec: number;
  workoutConfigId: string;
};
export async function createOne(
  createSetConfigRequest: CreateSetConfigRequest
) {
  try {
    const data = await SetConfig.create(createSetConfigRequest);
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}

export async function deleteOne(id: number) {
  try {
    const data = await SetConfig.destroy({
      where: {
        id,
      },
    });
    return data;
  } catch (err) {
    throw new Error(err as string);
  }
}
