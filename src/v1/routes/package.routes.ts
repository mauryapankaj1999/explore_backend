import express from "express";
import {
  createPackage,
  deletePackage,
  getPackageById,
  getPackageByPlaceId,
  getPackageBySlug,
  getPackages,
  getPackagesForUser,
  updatePackageById,
  updatePackageToggles,
} from "v1/controller/package.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createPackage);
router.get("/", getPackages);
router.get("/get_by_id/:id", getPackageById);
router.patch("/toggles", updatePackageToggles);
router.patch("/package/:id", updatePackageById);
router.delete("/", deletePackage);

/* USER */

router.get("/for_user", getPackagesForUser);
router.get("/get_by_slug/:slug", getPackageBySlug);
router.get("/get_by_place_id", getPackageByPlaceId);

export default router;
