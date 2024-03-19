import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { WorkoutConfig } from "./WorkoutConfig";

export const SetConfig = sequelize.define("SetConfig", {
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
SetConfig.belongsTo(WorkoutConfig);
