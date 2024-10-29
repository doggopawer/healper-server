import mongoose, { Schema, Document } from "mongoose";

// User 타입을 정의합니다.
export type UserType = {
    _id: number; // Mongoose에서는 자동 증가를 지원하지 않으므로, 이 필드는 필요하지 않을 수 있습니다.
    provider: string;
    providerId: string;
    name: string;
    email: string;
    profileImage: string;
};

// User 인터페이스
interface UserDocument extends Document {
    _id: string;
    provider: string;
    providerId: string;
    name: string;
    email: string;
    profileImage: string;
}

// User 스키마
const UserSchema = new Schema<UserDocument>({
    _id: { type: String, required: true },
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImage: { type: String, required: true },
});

// 모델 생성
const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
