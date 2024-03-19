import { DataTypes } from "sequelize";
import { sequelize } from "../db";
import { User } from "./User";

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
RoutineConfig.belongsTo(User);

console.log("실행 됨?"); // 이코드가 실행이 안되는것으로 보아 RoutineConfig.ts는 실행 조차 안되고 있다.
