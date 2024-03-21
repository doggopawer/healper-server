import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig } from "./workout-config";
import { SetConfig } from "./set-config";

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

export async function getWithSubDetailsByUserId(userId: string) {
  try {
    return await RoutineConfig.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: WorkoutConfig,
          include: [
            {
              model: SetConfig,
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
export async function create({ name, color, userId }: RoutineConfig) {
  try {
    const data = await RoutineConfig.create({ name, color, userId });
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}
