import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutRecord } from "./workout-record";

export const SetRecord = sequelize.define("SetRecord", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rep: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restSec: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
SetRecord.belongsTo(WorkoutRecord, { foreignKey: "workoutRecordId" });
