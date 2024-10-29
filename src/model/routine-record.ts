import mongoose, { Schema, Document } from "mongoose";
import { WorkoutLibrary } from "./workout-library"; // WorkoutLibraryModel에서 가져오기

// Color 타입을 정의합니다. (예: string으로 가정)
type Color = string;

// SetRecord 타입을 정의합니다.
export type SetRecord = {
    _id: string;
    weight: number;
    rep: number;
    restSec: number;
    workoutSec: number;
    createdAt: Date;
    updatedAt: Date;
    workoutRecordId: string;
    [key: string]: any;
};

// WorkoutRecord 타입을 정의합니다.
export type WorkoutRecord = {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    routineRecordId: string;
    setRecords: SetRecord[];
    workoutLibrary: WorkoutLibrary;
};

// RoutineRecord 인터페이스
interface RoutineRecordDocument extends Document {
    _id: string;
    name: string;
    color: Color;
    workoutTime: number;
    createdAt: Date;
    updatedAt: Date;
    workoutRecords: WorkoutRecord[];
    userId: string;
    [key: string]: any;
}

// RoutineRecord 스키마
const RoutineRecordSchema = new Schema<RoutineRecordDocument>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true }, // Color 타입에 맞게 수정
    workoutTime: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    workoutRecords: [
        {
            _id: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
            routineRecordId: { type: String, required: true },
            setRecords: [
                {
                    _id: { type: String, required: true },
                    weight: { type: Number, required: true },
                    rep: { type: Number, required: true },
                    restSec: { type: Number, required: true },
                    workoutSec: { type: Number, required: true },
                    createdAt: { type: Date, default: Date.now },
                    updatedAt: { type: Date, default: Date.now },
                    workoutRecordId: { type: String, required: true },
                },
            ],
            workoutLibrary: { type: Object, required: true }, // WorkoutLibrary의 구조에 맞게 수정
        },
    ],
    userId: { type: String, required: true },
});

// 모델 생성
const RoutineRecordModel = mongoose.model<RoutineRecordDocument>(
    "RoutineRecord",
    RoutineRecordSchema
);

export default RoutineRecordModel;
