import express from "express";
import {
  createAminity,
  deleteAminity,
  getAminity,
  getAminityById,
  updateAminityById,
} from "v1/controller/aminities.controller";
const router = express.Router();

router.post("/", createAminity);
router.get("/", getAminity); //same using for admin and user
router.get("/get_by_id/:id", getAminityById);
router.patch("/:id", updateAminityById);
router.delete("/", deleteAminity);

export default router;
