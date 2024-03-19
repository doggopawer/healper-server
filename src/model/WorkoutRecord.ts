import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { User } from "./User";
import { RoutineRecord } from "./RoutineRecord";

export const WorkoutRecord = sequelize.define("WorkoutRecord", {
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
WorkoutRecord.belongsTo(RoutineRecord);
WorkoutRecord.belongsTo(User);
