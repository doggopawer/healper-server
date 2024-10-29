import mongoose, { Schema, Document } from "mongoose";
import { WorkoutLibrary } from "./workout-library"; // WorkoutLibraryModel에서 가져오기

// Color 타입을 정의합니다. (예: string으로 가정)
type Color = string;

// SetConfig 타입을 정의합니다.
export type SetConfig = {
    _id: string;
    weight: number;
    rep: number;
    restSec: number;
    workoutSec: number;
    createdAt: Date;
    updatedAt: Date;
    workoutConfigId: string;
    [key: string]: any;
};

// WorkoutConfig 타입을 정의합니다.
export type WorkoutConfig = {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    routineConfigId: string;
    setConfigs: SetConfig[];
    workoutLibrary: WorkoutLibrary;
};

// RoutineConfig 인터페이스
interface RoutineConfigDocument extends Document {
    _id: string;
    name: string;
    color: Color;
    createdAt: Date;
    updatedAt: Date;
    workoutConfigs: WorkoutConfig[];
    userId: string;
    [key: string]: any;
}

// RoutineConfig 스키마
const RoutineConfigSchema = new Schema<RoutineConfigDocument>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true }, // Color 타입에 맞게 수정
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    workoutConfigs: [
        {
            _id: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
            routineConfigId: { type: String, required: true },
            setConfigs: [
                {
                    _id: { type: String, required: true },
                    weight: { type: Number, required: true },
                    rep: { type: Number, required: true },
                    restSec: { type: Number, required: true },
                    workoutSec: { type: Number, required: true },
                    createdAt: { type: Date, default: Date.now },
                    updatedAt: { type: Date, default: Date.now },
                    workoutConfigId: { type: String, required: true },
                },
            ],
            workoutLibrary: { type: Object, required: true }, // WorkoutLibrary의 구조에 맞게 수정
        },
    ],
    userId: { type: String, required: true },
});

// 모델 생성
const RoutineConfigModel = mongoose.model<RoutineConfigDocument>(
    "RoutineConfig",
    RoutineConfigSchema
);

export default RoutineConfigModel;
