import connectDB from "./db";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import * as Controller from "./controller";
import { isAuth } from "./middleware";
import multer from "multer";
import fs from "fs";
import https from "https";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const options = {
    key: fs.readFileSync("./cert/cert.key"), // 개인 키 경로
    cert: fs.readFileSync("./cert/cert.crt"), // 인증서 경로
};

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

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

connectDB()
    .then(() => {
        https.createServer(options, app).listen(443, () => {
            console.log("HTTPS server is running at https://localhost:4000");
        });

        // const newRoutine = new RoutineConfigModel({
        //     _id: "1234",
        //     name: "My Workout Routine",
        //     color: "blue",
        //     userId: "user123",
        // });

        // newRoutine
        //     .save()
        //     .then(() => {
        //         console.log("RoutineConfig Document saved successfully!");
        //     })
        //     .catch((err) => {
        //         console.error("Error saving Document:", err);
        //     });
    })
    .catch((e) => {
        console.error(e);
    });
