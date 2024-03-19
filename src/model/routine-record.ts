import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

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
RoutineRecord.belongsTo(User);
