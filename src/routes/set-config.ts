import express from "express";
import { isAuth } from "../middleware";
import * as SetConfigController from "../controller/set-config";

const router = express.Router();

router.get("/:workoutConfigId", isAuth, SetConfigController.getSetConfigs);
router.post("/", isAuth, SetConfigController.createSetConfig);
router.delete("/:id", isAuth, SetConfigController.deleteSetConfig);

export default router;
