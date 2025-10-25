import express from "express";
import {
  createFaq,
  deleteFaq,
  getFaqById,
  getFaqForPackage,
  getFaqs,
  updateFaqById,
} from "v1/controller/faq.controller";

const router = express.Router();

/* ADMIN */
router.post("/", createFaq);
router.get("/", getFaqs);
router.get("/get_by_id/:id", getFaqById);
router.patch("/:id", updateFaqById);
router.delete("/", deleteFaq);

/* ADMIN */
router.get("/for_place", getFaqForPackage);

export default router;
