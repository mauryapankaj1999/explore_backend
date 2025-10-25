import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogById,
  getBlogBySlug,
  updateBlogById,
} from "v1/controller/blog.controller";
const router = express.Router();

router.post("/", createBlog);
router.get("/", getBlog); //same using for admin and user
router.get("/get_by_id/:id", getBlogById);
router.get("/get_by_slug/:slug", getBlogBySlug);
router.patch("/:id", updateBlogById);
router.delete("/", deleteBlog);

export default router;
