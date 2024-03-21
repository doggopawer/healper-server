import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const WorkoutLibrary = sequelize.define("WorkoutLibrary", {
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
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
