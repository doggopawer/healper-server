import { sequelize } from "./db";
import { RoutineConfig } from "./model/RoutineConfig";
import { RoutineRecord } from "./model/RoutineRecord";
import { SetConfig } from "./model/SetConfig";
import { SetRecord } from "./model/SetRecord";
import { User } from "./model/User";
import { WorkoutConfig } from "./model/WorkoutConfig";
import { WorkoutLibrary } from "./model/WorkoutLibrary";
import { WorkoutRecord } from "./model/WorkoutRecord";

User;
RoutineConfig;
RoutineRecord;
SetConfig;
SetRecord;
WorkoutConfig;
WorkoutRecord;
WorkoutLibrary;

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(() => {
    console.error("Unable to connect to the database.");
  });
