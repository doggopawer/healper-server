import express from "express";
import * as WorkoutConfigController from "../controller/workout-config";
import { isAuth } from "../middleware";

const router = express.Router();

router.get(
  "/:routineConfigId",
  isAuth,
  WorkoutConfigController.getWorkoutConfigs
);
router.post("/", isAuth, WorkoutConfigController.createWorkoutConfig);
router.delete("/:id", isAuth, WorkoutConfigController.deleteWorkoutConfig);

export default router;
