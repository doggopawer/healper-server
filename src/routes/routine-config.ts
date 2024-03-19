import express from "express";
import * as RoutineConfigController from "../controller/routine-config";

const router = express.Router();

router.get("/", RoutineConfigController.getAllRoutineConfigs);
router.get("/:id");
router.post("/", RoutineConfigController.createRoutineConfig);
router.put("/:id");
router.delete("/:id");

export default router;
