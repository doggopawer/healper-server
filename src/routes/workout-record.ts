import express from "express";
import { isAuth } from "../middleware";
import * as WorkoutRecordController from "../controller/workout-record";

const router = express.Router();

router.get(
    "/:routineRecordId",
    isAuth,
    WorkoutRecordController.getWorkoutRecordAll
);
router.post("/", isAuth, WorkoutRecordController.createWorkoutRecordOne);
router.delete("/:id", isAuth, WorkoutRecordController.deleteWorkoutRecordOne);

export default router;
