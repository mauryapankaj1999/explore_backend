import express from "express";
import { createLanding, createLandingUtm, deleteLanding, getLanding } from "v1/controller/landing.controller";

const router = express.Router();

router.post("/", createLanding);
router.post("/utm", createLandingUtm);
router.get("/", getLanding);
router.delete("/:id", deleteLanding);

export default router;
