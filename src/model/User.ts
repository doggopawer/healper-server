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
  name: {
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

export const getOneById = async (providerId: string) => {
  try {
    return User.findOne({
      where: {
        providerId,
      },
    });
  } catch (err) {
    throw new Error(err as string);
  }
};

type CreateUserRequest = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export const createOne = async (createUserRequest: CreateUserRequest) => {
  const { id, email, name, picture } = createUserRequest;
  try {
    const data = await User.create({
      provider: "Google",
      providerId: id,
      name,
      email,
      profileImage: picture,
    });
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
};
