import mongoose, { Schema, Document } from "mongoose";

// Color 타입을 정의합니다. (예: string으로 가정)
type Color = string;

// WorkoutLibrary 타입을 정의합니다.
export type WorkoutLibrary = {
    _id: string;
    name: string;
    image: string;
    original: string;
    category: string;
    type: string[];
    isEditable: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    [key: string]: any;
};

// WorkoutLibrary 인터페이스
interface WorkoutLibraryDocument extends Document {
    _id: string;
    name: string;
    image: string;
    original: string;
    category: string;
    type: string[];
    isEditable: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    [key: string]: any;
}

// WorkoutLibrary 스키마
const WorkoutLibrarySchema = new Schema<WorkoutLibraryDocument>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    original: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: [String], required: true },
    isEditable: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
});

// 모델 생성
const WorkoutLibraryModel = mongoose.model<WorkoutLibraryDocument>(
    "WorkoutLibrary",
    WorkoutLibrarySchema
);

export default WorkoutLibraryModel;
