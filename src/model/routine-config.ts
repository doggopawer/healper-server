import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig } from "./workout-config";
import { SetConfig } from "./set-config";
import { RoutineRequest } from "../type";

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

export async function getWithSubDetailsByUserId(userId: number) {
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

type RoutineConfig = {
  name: string;
  color: string;
  userId: number;
};
export async function create(routineRequest: RoutineRequest) {
  try {
    const data = await RoutineConfig.create(routineRequest, {
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
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}
