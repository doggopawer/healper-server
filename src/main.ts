import { Sequelize } from "sequelize";

const sequelize = new Sequelize("healper", "root", "xxxx", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("연결 성공"))
  .catch(() => console.log("연결 실패"));
