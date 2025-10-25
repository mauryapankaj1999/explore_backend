import express from "express";
import {
  createGroupTour,
  deleteGroupTour,
  getActiveGroupTourForUser,
  getGroupTour,
  getGroupTourById,
  updateGroupTourById,
  updateGroupTourStatus,
} from "v1/controller/groupTour.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createGroupTour);
router.get("/", getGroupTour);
router.get("/get_by_id/:id", getGroupTourById);
router.patch("/", updateGroupTourStatus);
router.patch("/group_tour/:id", updateGroupTourById);
router.delete("/", deleteGroupTour);

/* USER */
router.get("/active", getActiveGroupTourForUser);

export default router;
