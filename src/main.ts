import { sequelize } from "./db";
import express from "express";
import { RoutineConfig } from "./model/routine-config";
import { RoutineRecord } from "./model/routine-record";
import { SetConfig } from "./model/set-config";
import { SetRecord } from "./model/set-record";
import { User } from "./model/user";
import { WorkoutConfig } from "./model/workout-config";
import { WorkoutLibrary } from "./model/workout-library";
import { WorkoutRecord } from "./model/workout-record";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import { config } from "./config";
import UserRouter from "./routes/user";
import WorkoutLibraryRouter from "./routes/workout-library";
import RoutineConfigRouter from "./routes/routine-config";
import WorkoutConfigRouter from "./routes/workout-config";
import SetConfigRouter from "./routes/set-config";
import RoutineRecordRouter from "./routes/routine-record";
import WorkoutRecordRouter from "./routes/workout-record";
import SetRecordRouter from "./routes/set-record";
import "./model/associations";
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

app.use("/user", UserRouter);
app.use("/workout-library", WorkoutLibraryRouter);
app.use("/routine-config", RoutineConfigRouter);
app.use("/workout-config", WorkoutConfigRouter);
app.use("/set-config", SetConfigRouter);
app.use("/routine-record", RoutineRecordRouter);
app.use("/workout-record", WorkoutRecordRouter);
app.use("/set-record", SetRecordRouter);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running at 3000");
    });
  })
  .catch(() => {
    console.error("Unable to connect to the database.");
  });
