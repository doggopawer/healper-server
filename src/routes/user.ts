import express from "express";
import * as UserController from "../controller/user";

const router = express.Router();

router.get("/");
router.get("/login", UserController.loginUser);
router.get("/login/redirect", UserController.loginRedirectUser);

export default router;
