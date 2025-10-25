import express from "express";
import {
  createPartners,
  deletePartners,
  getPartnerById,
  getPartners,
  updatePartnerById,
} from "v1/controller/partners.controller";

const router = express.Router();

router.post("/", createPartners);
router.get("/", getPartners);
router.get("/get_by_id/:id", getPartnerById);
router.patch("/partner/:id", updatePartnerById);
router.delete("/", deletePartners);

export default router;
