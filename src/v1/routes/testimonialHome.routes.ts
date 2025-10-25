import express from "express";
import {
  createTestimonialHome,
  deleteTestimonialHome,
  getTestimonialHome,
  getTestimonialHomeById,
  updateTestimonialHomeById,
} from "v1/controller/testimonialHome.controller";
const router = express.Router();

router.post("/", createTestimonialHome);
router.get("/", getTestimonialHome); //same using for admin and user
router.get("/get_by_id/:id", getTestimonialHomeById);
router.patch("/:id", updateTestimonialHomeById);
router.delete("/", deleteTestimonialHome);

export default router;
