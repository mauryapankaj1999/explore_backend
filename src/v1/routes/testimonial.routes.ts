import express from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  getTestimonialById,
  updateTestimonialById,
} from "v1/controller/testimonial.controller";

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getTestimonial); //same using for admin and user
router.get("/get_by_id/:id", getTestimonialById);
router.patch("/:id", updateTestimonialById);
router.delete("/", deleteTestimonial);

export default router;
