import { DataTypes } from "sequelize";
import { sequelize } from "../db";

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

// export const create = async (order) => {
//   // 운동설정 데이터를 추가하는 메소드 불러오기
//   const data = await SetConfig.create({ order, weight, rep, restSec });
//   // 생성된 운동설정 데이터 반환하기
//   return data.dataValues;
// };
