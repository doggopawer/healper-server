import express from "express";
import * as RoutineConfigController from "../controller/routine-config";
import { isAuth } from "../middleware";

const router = express.Router();

router.get("/", isAuth, RoutineConfigController.getRoutineConfigs);
router.get("/:id", isAuth, RoutineConfigController.getRoutineConfig);
router.post("/", isAuth, RoutineConfigController.createRoutineConfig);
router.put("/:id");
router.delete("/:id");

export default router;
