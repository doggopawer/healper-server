import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

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
RoutineConfig.belongsTo(User, { foreignKey: "userId" });

export async function getAll() {
  try {
    return RoutineConfig.findAll();
  } catch (err) {
    throw new Error(err as string);
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
