import { Sequelize } from "sequelize";
import { config } from "./config";

const { host, user, password, database } = config.db;

const sequelize = new Sequelize(database as string, user as string, password, {
  host,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("연결 성공"))
  .catch(() => console.log("연결 실패"));
