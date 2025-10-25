import express from "express";
import {
  createBanner,
  getBanner,
  updateBannerStatus,
  deleteBanner,
  getActiveBanner,
  getBannerById,
  updateBanner,
} from "v1/controller/banner.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createBanner);
router.get("/", getBanner);
router.get("/get_by_id/:id", getBannerById);
router.patch("/", updateBannerStatus);
router.patch("/banner/:id", updateBanner);
router.delete("/", deleteBanner);

/* USER */
router.get("/active", getActiveBanner);

export default router;
