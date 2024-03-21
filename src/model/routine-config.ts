import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig } from "./workout-config";
import { SetConfig } from "./set-config";
import { RoutineRequest, WorkoutRequest } from "../type";

export const RoutineConfig = sequelize.define("RoutineConfig", {
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

export async function getAllWithSubDetails(userId: number) {
  try {
    return await RoutineConfig.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: WorkoutConfig,
          as: "workoutConfigs",
          include: [
            {
              model: SetConfig,
              as: "setConfigs",
            },
          ],
        },
      ],
    });
  } catch (err) {
    throw new Error(err as string); // err가 Error 타입임을 가정
  }
}

export async function getOneWithSubDetailsById(userId: number, id: number) {
  try {
    return await RoutineConfig.findOne({
      where: {
        userId,
        id,
      },
      include: [
        {
          model: WorkoutConfig,
          as: "workoutConfigs",
          include: [
            {
              model: SetConfig,
              as: "setConfigs",
            },
          ],
        },
      ],
    });
  } catch (err) {
    throw new Error(err as string); // err가 Error 타입임을 가정
  }
}

type CreateRoutineConfigRequest = {
  name: string;
  color: string;
  userId: number;
};
export async function createOne(
  CreateRoutineConfigRequest: CreateRoutineConfigRequest
) {
  try {
    const data = await RoutineConfig.create(CreateRoutineConfigRequest);
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}

export async function remove(id: number) {
  try {
    const data = await RoutineConfig.destroy({
      where: {
        id,
      },
    });
    return data;
  } catch (err) {
    throw new Error(err as string);
  }
}
