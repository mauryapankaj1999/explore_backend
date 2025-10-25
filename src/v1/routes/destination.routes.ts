import express from "express";
import {
  createDestination,
  deleteDestination,
  getDestinationById,
  getDestinations,
  updateDestination,
} from "v1/controller/destination.controller";

const router = express.Router();

router.post("/", createDestination);
router.get("/", getDestinations);
router.get("/get_by_id/:id", getDestinationById);
router.patch("/:id", updateDestination);
router.delete("/", deleteDestination);

router.get("/by_place_id", getDestinations);

export default router;
