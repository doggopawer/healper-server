import { RoutineConfig } from "./routine-config";
import { RoutineRecord } from "./routine-record";
import { SetConfig } from "./set-config";
import { SetRecord } from "./set-record";
import { User } from "./user";
import { WorkoutConfig } from "./workout-config";
import { WorkoutLibrary } from "./workout-library";
import { WorkoutRecord } from "./workout-record";

User.hasMany(RoutineConfig);
RoutineConfig.belongsTo(User);

User.hasMany(RoutineRecord);
RoutineRecord.belongsTo(User, { foreignKey: "userId" });

User.hasMany(WorkoutRecord);
WorkoutRecord.belongsTo(User, { foreignKey: "userId" });

User.hasMany(WorkoutLibrary);
WorkoutLibrary.belongsTo(User, { foreignKey: "userId" });

RoutineConfig.hasMany(WorkoutConfig);
WorkoutConfig.belongsTo(RoutineConfig);

WorkoutConfig.hasMany(SetConfig);
SetConfig.belongsTo(WorkoutConfig, { foreignKey: "workoutConfigId" });

RoutineRecord.hasMany(WorkoutRecord);
WorkoutRecord.belongsTo(RoutineRecord, { foreignKey: "routineRecordId" });

WorkoutRecord.hasMany(SetRecord);
SetRecord.belongsTo(WorkoutRecord, { foreignKey: "workoutRecordId" });
