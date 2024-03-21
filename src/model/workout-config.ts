import { DataTypes } from "sequelize";
import { sequelize } from "../db";

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

export const create = async (name: string, type: string) => {
  // 운동설정 데이터를 추가하는 메소드 불러오기
  const data = await WorkoutConfig.create({ name, type });
  // 생성된 운동설정 데이터 반환하기
  return data.dataValues;
};
