import express from "express";
import { webLogin } from "v1/controller/users.controller";

const router = express.Router();

router.post("/login", webLogin);

export default router;
