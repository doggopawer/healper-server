import connectDB from "./db";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import * as Controller from "./controller";
import { isAuth } from "./middleware";
import multer from "multer";
// import fs from "fs"; // 필요 없음
// import https from "https"; // 필요 없음

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// middleware 설정
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// API 엔드포인트 설정
app.get("/check", isAuth, Controller.checkAccessToken);
app.get("/user", isAuth, Controller.getUser);
app.get("/login", Controller.loginUser);
app.get("/login/redirect", Controller.loginRedirectUser);
app.post("/sync", isAuth, Controller.syncData);
app.delete(
    "/routine-config/:routineConfigId",
    isAuth,
    Controller.deleteRoutineConfig
);
app.delete(
    "/routine-record/:routineRecordId",
    isAuth,
    Controller.deleteRoutineRecord
);
app.delete(
    "/workout-library/:workoutLibraryId",
    isAuth,
    Controller.deleteWorkoutLibrary
);
app.post("/upload-image", upload.single("image"), Controller.uploadImage);

// 데이터베이스 연결 후 HTTP 서버 실행
connectDB()
    .then(() => {
        app.listen(4000, () => {
            // HTTP로 포트 3000에서 실행
            console.log("HTTP server is running at http://localhost:4000");
        });
    })
    .catch((e) => {
        console.error(e);
    });
