import express from "express";
import {
  createPlace,
  getPlaces,
  updatePlaceToggles,
  updateIsTopDestinationOrder,
  getPlacesForUsers,
  getBySlug,
  deletePlace,
  getPlaceById,
  udpatePlaceById,
} from "../controller/place.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createPlace);
router.get("/", getPlaces);
router.get("/get_by_id/:id", getPlaceById);
router.patch("/place/:id", udpatePlaceById);
router.patch("/toggles", updatePlaceToggles);
router.patch("/is_top_destination_order", updateIsTopDestinationOrder);
router.delete("/", deletePlace);

/* USER */
router.get("/for_user", getPlacesForUsers);
router.get("/get_by_slug/:slug", getBySlug);

export default router;
