import express from "express";
import {
    createRoutineRecordOne,
    deleteRoutineRecordOne,
    getRoutineRecordAll,
    getRoutineRecordOne,
    updateRoutineRecordOne,
} from "../controller/routine-record";
import { isAuth } from "../middleware";

const router = express.Router();

router.get("/", isAuth, getRoutineRecordAll);
router.get("/:id", isAuth, getRoutineRecordOne);
router.post("/", isAuth, createRoutineRecordOne);
router.put("/:id", isAuth, updateRoutineRecordOne);
router.delete("/:id", isAuth, deleteRoutineRecordOne);

export default router;
