import { NextFunction, Request, Response } from "express";
import { Package } from "models/package.model";
import { Testimonial } from "models/testimonial.model";
import { PipelineStage } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, packageId, image, description, rating } = req.body;

    console.log(req.body, "BODY TESTIMONIAL");
    const requiredFields: any = {
      Name: name,
      Package_Id: packageId,
      Image: image,
      Rating: rating,
      Description: description,
    };

    verifyRequiredFields(requiredFields);

    image = await storeFileAndReturnNameBase64(image);

    const packag = await Package.findById(packageId).lean().exec();

    if (!packag) throw new Error("Can't found Package");

    await Testimonial.create({
      name,
      packageName: packag?.name,
      packageId: packag?._id,
      image,
      rating,
      description,
    });

    res.status(201).json({ message: "Successfully created Testimonial" });
  } catch (error) {
    next(error);
  }
};

export const getTestimonial = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(Testimonial, pipeline, req.query);
    res.status(200).json({ message: "All Testimonial.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Testimonial");

    const testimonial = await Testimonial.findById(id).lean().exec();

    if (!testimonial) throw new Error("Can't find Testimonial");

    res.status(200).json({ message: "testimonial By Id", data: testimonial });
  } catch (error) {
    next(error);
  }
};
export const updateTestimonialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find testimonial");

    const testimonial = await Testimonial.findById(id).lean().exec();

    if (!testimonial) throw new Error("Can't find testimonial");

    let { name, packageName, packageId, image, description, rating } = req.body;
    console.log(req.body, "TESTIMONIAL UPDATE BODY ");

    let updateObj: any = {};

    if (name) {
      updateObj.name = name;
    }

    if (packageName) {
      updateObj.packageName = packageName;
    }

    if (packageId) {
      const packag = await Package.findById(packageId).lean().exec();
      updateObj.packageName = packag?.name;
    }

    if (image) {
      updateObj.image = await storeFileAndReturnNameBase64(image);
    }

    if (description) {
      updateObj.description = description;
    }

    if (rating) {
      updateObj.rating = rating;
    }

    console.log(updateObj, "UPDATED TESTIMONIAL..");
    await Testimonial.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Testimonial updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testimonialId } = req.query;

    if (!testimonialId) throw new Error("Can't found Testimonial");

    const exist = await Testimonial.findById(testimonialId).lean().exec();

    if (!exist) throw new Error("Can't found Testimonial");

    await Testimonial.findByIdAndDelete(testimonialId).lean().exec();

    res.status(200).json({ message: "Testimonial Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
