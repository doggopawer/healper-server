import { DataTypes, Model, ModelCtor } from "sequelize";
import { sequelize } from "../db";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}) as ModelCtor<any>;

export const getOneById = (id: string) => {
  try {
    return User.findOne({
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(err as string);
  }
};
