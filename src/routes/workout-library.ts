import express from "express";
import { isAuth } from "../middleware";
import * as WorkoutLibraryController from "../controller/workout-library";

const router = express.Router();

router.get("/", isAuth, WorkoutLibraryController.getWorkoutLibraryAll);
router.post("/", isAuth, WorkoutLibraryController.createWorkoutLibraryOne);
router.put("/:id", isAuth, WorkoutLibraryController.updateWorkoutLibraryOne);
router.delete("/:id", isAuth, WorkoutLibraryController.deleteWorkoutLibraryOne);

export default router;
