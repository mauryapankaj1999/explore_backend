import express from "express";
import { createContactUs, deleteContactUs, getContactUs } from "v1/controller/contactus.controller";

const router = express.Router();

router.post("/", createContactUs);
router.get("/", getContactUs);
router.delete("/:id", deleteContactUs);

export default router;
