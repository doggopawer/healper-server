import { sequelize } from "./db";

sequelize
  .authenticate()
  .then(() => console.log("연결 성공"))
  .catch(() => console.log("연결 실패"));
