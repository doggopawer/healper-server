import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig } from "./workout-config";

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

export async function getAll() {
  try {
    const routines = await RoutineConfig.findAll({
      include: [
        {
          model: WorkoutConfig,
          through: {
            attributes: [
              /* list the wanted attributes here */
            ],
          },
        },
      ],
    });

    await WorkoutConfig.findAll({
      include: {
        model: RoutineConfig,
      },
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
