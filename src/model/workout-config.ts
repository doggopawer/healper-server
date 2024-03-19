import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { RoutineConfig } from "./routine-config";

export const WorkoutConfig = sequelize.define("WorkoutConfig", {
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
WorkoutConfig.belongsTo(RoutineConfig, { foreignKey: "routineConfigId" });
