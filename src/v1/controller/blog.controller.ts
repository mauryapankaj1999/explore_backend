import { NextFunction, Request, Response } from "express";
import { Blog } from "models/blog.model";
import { PipelineStage } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";
import { createSlug, generateUniqueSlug } from "utils/slug";

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { title, cover, description, place, priority, date, thumbnail, metaTitle, metaDescription } = req.body;

    console.log(req.body, "BODY Blog");
    const requiredFields: any = {
      Title: title,
      Image: cover,
      Place: place,
      Date: date,
      Thumbnail: thumbnail,
      Description: description,
    };

    verifyRequiredFields(requiredFields);

    cover = await storeFileAndReturnNameBase64(cover);

    let baseSlug = createSlug(title);
    let uniqueSlug = await generateUniqueSlug(baseSlug, Blog);

    await Blog.create({
      title,
      place,
      priority,
      date,
      cover,
      thumbnail,
      description,
      slug: uniqueSlug,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({ message: "Successfully created Blog" });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let sortObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];


    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Blog, pipeline, req.query);
    res.status(200).json({ message: "All Blog.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Blog");

    const blog = await Blog.findById(id).lean().exec();

    if (!blog) throw new Error("Can't find Blog");

    res.status(200).json({ message: "Blog By Id", data: blog });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (!slug) throw new Error("Can't find Blog !");
    const blog = await Blog.findOne({ slug: slug }).lean().exec();
    if (!blog) throw new Error("Can't find Blog !");
    res.status(200).json({ message: "Single Blog by slug", data: blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Blog");

    const blog = await Blog.findById(id).lean().exec();

    if (!blog) throw new Error("Can't find Blog");

    let { title, cover, description, place, priority, date, thumbnail, metaTitle, metaDescription } = req.body;

    let updateObj: any = {};

    if (metaTitle) {
      updateObj.metaTitle = metaTitle;
    }

    if (metaDescription) {
      updateObj.metaDescription = metaDescription;
    }

    if (title) {
      updateObj.title = title;
    }

    if (thumbnail) {
      updateObj.thumbnail = await storeFileAndReturnNameBase64(thumbnail);
    }

    if (date) {
      updateObj.date = date;
    }

    if (place) {
      updateObj.place = place;
    }

    if (priority) {
      updateObj.priority = priority;
    }

    if (cover) {
      updateObj.cover = await storeFileAndReturnNameBase64(cover);
    }

    if (description) {
      updateObj.description = description;
    }

    if (title !== blog.title) {
      let baseSlug = createSlug(title);
      let uniqueSlug = await generateUniqueSlug(baseSlug, Blog);
      updateObj.slug = uniqueSlug;
    }

    await Blog.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { BlogId } = req.query;

    if (!BlogId) throw new Error("Can't found Blog");

    const exist = await Blog.findById(BlogId).lean().exec();

    if (!exist) throw new Error("Can't found Blog");

    await Blog.findByIdAndDelete(BlogId).lean().exec();

    res.status(200).json({ message: "Blog Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
