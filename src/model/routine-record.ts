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
