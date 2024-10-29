import connectDB from "./db";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import * as Controller from "./controller";
import { isAuth } from "./middleware";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.get("/login", Controller.loginUser);
app.get("/login/redirect", Controller.loginRedirectUser);
app.get("/sync", isAuth, Controller.syncData);

connectDB()
    .then(() => {
        app.listen(4000, () => {
            console.log("server is running at 4000");
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
    .catch(() => {
        console.error("Unable to connect to the database.");
    });
