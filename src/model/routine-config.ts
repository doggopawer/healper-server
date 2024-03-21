import { DataTypes } from "sequelize";
import { sequelize } from "../db";

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

export async function getAll(userId: number) {
  try {
    return await RoutineConfig.findAll({
      where: {
        userId,
      },
    });
  } catch (err) {
    throw new Error(err as string); // err가 Error 타입임을 가정
  }
}

export async function getOneById(userId: number, id: number) {
  try {
    return await RoutineConfig.findOne({
      where: {
        userId,
        id,
      },
    });
  } catch (err) {
    throw new Error(err as string); // err가 Error 타입임을 가정
  }
}

type CreateRoutineConfigRequest = {
  name: string;
  color: string;
  userId: number;
};
export async function createOne(
  CreateRoutineConfigRequest: CreateRoutineConfigRequest
) {
  try {
    const data = await RoutineConfig.create(CreateRoutineConfigRequest);
    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}

type UpdateRoutineConfigRequest = {
  id: number;
  name: string;
  color: string;
  userId: number;
};
export async function updateOne(
  updateRoutineConfigRequest: UpdateRoutineConfigRequest
) {
  const { name, color, id } = updateRoutineConfigRequest;
  try {
    const data = await RoutineConfig.findByPk(id);

    if (!data) {
      throw new Error("not found");
    }

    data.set({
      name,
      color,
    });
    await data.save();

    return data.dataValues;
  } catch (err) {
    throw new Error(err as string);
  }
}

export async function deleteOne(id: number) {
  try {
    const data = await RoutineConfig.destroy({
      where: {
        id,
      },
    });
    return data;
  } catch (err) {
    throw new Error(err as string);
  }
}
