import { Sequelize } from "sequelize";
import { config } from "../config";

const { host, user, password, database } = config.db;

export const sequelize = new Sequelize(
  database as string,
  user as string,
  password,
  {
    host,
    dialect: "mysql",
  }
);
