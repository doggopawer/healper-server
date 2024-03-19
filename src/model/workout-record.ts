import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";
import { RoutineRecord } from "./routine-record";

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
WorkoutRecord.belongsTo(RoutineRecord, { foreignKey: "routineRecordId" });
WorkoutRecord.belongsTo(User, { foreignKey: "userId" });
