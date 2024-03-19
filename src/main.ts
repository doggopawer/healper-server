import { sequelize } from "./db";
import express from "express";
import { RoutineConfig } from "./model/RoutineConfig";
import { RoutineRecord } from "./model/RoutineRecord";
import { SetConfig } from "./model/SetConfig";
import { SetRecord } from "./model/SetRecord";
import { User } from "./model/User";
import { WorkoutConfig } from "./model/WorkoutConfig";
import { WorkoutLibrary } from "./model/WorkoutLibrary";
import { WorkoutRecord } from "./model/WorkoutRecord";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

User;
RoutineConfig;
RoutineRecord;
SetConfig;
SetRecord;
WorkoutConfig;
WorkoutRecord;
WorkoutLibrary;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(() => {
    console.error("Unable to connect to the database.");
  });
