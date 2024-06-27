import express from "express";
import { isAuth } from "../middleware";
import * as SetRecordController from "../controller/set-record";

const router = express.Router();

router.get("/:workoutRecordId", isAuth, SetRecordController.getSetRecordAll);
router.post("/", isAuth, SetRecordController.createSetRecordOne);

export default router;
