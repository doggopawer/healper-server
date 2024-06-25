import { RoutineConfig } from "./routine-config";
import { RoutineRecord } from "./routine-record";
import { SetConfig } from "./set-config";
import { SetRecord } from "./set-record";
import { User } from "./user";
import { WorkoutConfig } from "./workout-config";
import { WorkoutLibrary } from "./workout-library";
import { WorkoutRecord } from "./workout-record";

User.hasMany(RoutineConfig, {
    as: "routineConfigs",
    foreignKey: "userId",
    onDelete: "CASCADE",
});
RoutineConfig.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(RoutineRecord, {
    as: "routineRecords",
    foreignKey: "userId",
    onDelete: "CASCADE",
});
RoutineRecord.belongsTo(User, { as: "user", foreignKey: "userId" });

// User.hasMany(WorkoutRecord, {
//     as: "workoutRecords",
//     foreignKey: "userId",
//     onDelete: "CASCADE",
// });
// WorkoutRecord.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(WorkoutLibrary, {
    as: "workoutLibraries",
    foreignKey: "userId",
    onDelete: "CASCADE",
});
WorkoutLibrary.belongsTo(User, { as: "user", foreignKey: "userId" });

RoutineConfig.hasMany(WorkoutConfig, {
    as: "workoutConfigs",
    foreignKey: "routineConfigId",
    onDelete: "CASCADE",
});
WorkoutConfig.belongsTo(RoutineConfig, {
    as: "routineConfig",
    foreignKey: "routineConfigId",
});

WorkoutConfig.hasMany(SetConfig, {
    as: "setConfigs",
    foreignKey: "workoutConfigId",
    onDelete: "CASCADE",
});
SetConfig.belongsTo(WorkoutConfig, {
    as: "workoutConfig",
    foreignKey: "workoutConfigId",
});

RoutineRecord.hasMany(WorkoutRecord, {
    as: "workoutRecords",
    foreignKey: "routineRecordId",
    onDelete: "CASCADE",
});
WorkoutRecord.belongsTo(RoutineRecord, {
    as: "routineRecord",
    foreignKey: "routineRecordId",
});

WorkoutRecord.hasMany(SetRecord, {
    as: "setRecords",
    foreignKey: "workoutRecordId",
    onDelete: "CASCADE",
});
SetRecord.belongsTo(WorkoutRecord, {
    as: "workoutRecord",
    foreignKey: "workoutRecordId",
});
