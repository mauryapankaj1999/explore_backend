import express from "express";
import {
  createMostViewedDestination,
  getMostViewedDestination,
  getMostViewedDestinationForUser,
  updateOrder,
  deleteMostViewedDestination,
  getMostViewedDestinationById,
  updateMostViewedDestinationById,
} from "v1/controller/mostViewedDestination.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createMostViewedDestination);
router.get("/", getMostViewedDestination);
router.get("/get_by_id/:id", getMostViewedDestinationById);
router.patch("/most_viewed/:id", updateMostViewedDestinationById);
router.patch("/order", updateOrder);
router.delete("/", deleteMostViewedDestination);

/* USER */
router.get("/for_user", getMostViewedDestinationForUser);

export default router;
