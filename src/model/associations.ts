import { RoutineConfig } from "./routine-config";
import { RoutineRecord } from "./routine-record";
import { SetConfig } from "./set-config";
import { SetRecord } from "./set-record";
import { User } from "./user";
import { WorkoutConfig } from "./workout-config";
import { WorkoutLibrary } from "./workout-library";
import { WorkoutRecord } from "./workout-record";

User.hasMany(RoutineConfig, { as: "routineConfigs", foreignKey: "userId" });
RoutineConfig.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(RoutineRecord, { as: "routineRecords", foreignKey: "userId" });
RoutineRecord.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(WorkoutRecord, { as: "workoutRecords", foreignKey: "userId" });
WorkoutRecord.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(WorkoutLibrary, { as: "workoutLibraries", foreignKey: "userId" });
WorkoutLibrary.belongsTo(User, { as: "user", foreignKey: "userId" });

RoutineConfig.hasMany(WorkoutConfig, {
  as: "workoutConfigs",
  foreignKey: "routineConfigId",
});
WorkoutConfig.belongsTo(RoutineConfig, {
  as: "routineConfig",
  foreignKey: "routineConfigId",
});

WorkoutConfig.hasMany(SetConfig, {
  as: "setConfigs",
  foreignKey: "workoutConfigId",
});
SetConfig.belongsTo(WorkoutConfig, {
  as: "workoutConfig",
  foreignKey: "workoutConfigId",
});

RoutineRecord.hasMany(WorkoutRecord, {
  as: "workoutRecords",
  foreignKey: "routineRecordId",
});
WorkoutRecord.belongsTo(RoutineRecord, {
  as: "routineRecord",
  foreignKey: "routineRecordId",
});

WorkoutRecord.hasMany(SetRecord, {
  as: "setRecords",
  foreignKey: "workoutRecordId",
});
SetRecord.belongsTo(WorkoutRecord, {
  as: "workoutRecord",
  foreignKey: "workoutRecordId",
});
