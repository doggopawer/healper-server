import connectDB from "./db";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// app.use("/user", UserRouter);
// app.use("/workout-library", WorkoutLibraryRouter);
// app.use("/routine-config", RoutineConfigRouter);
// app.use("/workout-config", WorkoutConfigRouter);
// app.use("/set-config", SetConfigRouter);
// app.use("/routine-record", RoutineRecordRouter);
// app.use("/workout-record", WorkoutRecordRouter);
// app.use("/set-record", SetRecordRouter);

connectDB()
    .then(() => {
        app.listen(4000, () => {
            console.log("server is running at 4000");
        });
    })
    .catch(() => {
        console.error("Unable to connect to the database.");
    });
