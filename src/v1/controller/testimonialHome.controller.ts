import { NextFunction, Request, Response } from "express";
import { Aminity } from "models/amenities.model";
import { TestimonialHome } from "models/testimonialHome.model";
import { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

export const createTestimonialHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { banner, title, tagline } = req.body;

    if (!banner) throw new Error("Image is required!");
    if (!title) throw new Error("Title is required!");
    if (!tagline) throw new Error("Tagline is required!");

    banner = await storeFileAndReturnNameBase64(banner);

    await TestimonialHome.create({ title, banner, tagline });

    res.status(201).json({ message: "Successfully created Testimonial Home." });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(TestimonialHome, pipeline, req.query);
    res.status(200).json({ message: "All Testimonial Home.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialHomeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Testimonial Home");

    const testimonialHome = await TestimonialHome.findById(id).lean().exec();

    if (!testimonialHome) throw new Error("Can't find Testimonial Home");

    res.status(200).json({ message: "Testimonial Home By Id", data: testimonialHome });
  } catch (error) {
    next(error);
  }
};
export const updateTestimonialHomeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find TestimonialHome");

    const testimonialHome = await TestimonialHome.findById(id).lean().exec();

    if (!testimonialHome) throw new Error("Can't find testimonialHome");

    let { title, banner, tagline } = req.body;

    let updateObj: any = {};

    if (title) {
      updateObj.title = title;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (banner) {
      updateObj.banner = await storeFileAndReturnNameBase64(banner);
    }

    await TestimonialHome.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "testimonialHome updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonialHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testimonialHomeId } = req.query;

    if (!testimonialHomeId) throw new Error("Can't found TestimonialHome");

    const exist = await TestimonialHome.findById(testimonialHomeId).lean().exec();

    if (!exist) throw new Error("Can't found TestimonialHome");

    await TestimonialHome.findByIdAndDelete(testimonialHomeId).lean().exec();

    res.status(200).json({ message: "TestimonialHome Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
