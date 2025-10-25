import { NextFunction, Request, Response } from "express";
import { Aminity } from "models/amenities.model";
import { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

export const createAminity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { image, title } = req.body;

    if (!image) throw new Error("Image is required!");
    if (!title) throw new Error("Title is required!");

    image = await storeFileAndReturnNameBase64(image);

    await Aminity.create({ title, image });

    res.status(201).json({ message: "Successfully created Aminity." });
  } catch (error) {
    next(error);
  }
};

export const getAminity = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(Aminity, pipeline, req.query);
    res.status(200).json({ message: "All Aminity.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getAminityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Aminity");

    const aminity = await Aminity.findById(id).lean().exec();

    if (!aminity) throw new Error("Can't find Aminity");

    res.status(200).json({ message: "Aminity By Id", data: aminity });
  } catch (error) {
    next(error);
  }
};
export const updateAminityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Aminity");

    const aminity = await Aminity.findById(id).lean().exec();

    if (!aminity) throw new Error("Can't find Aminity");

    let { title, image } = req.body;

    let updateObj: any = {};

    if (title) {
      updateObj.title = title;
    }

    if (image) {
      updateObj.image = await storeFileAndReturnNameBase64(image);
    }

    await Aminity.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Aminity updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteAminity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { aminityId } = req.query;

    if (!aminityId) throw new Error("Can't found Aminity");

    const exist = await Aminity.findById(aminityId).lean().exec();

    if (!exist) throw new Error("Can't found Aminity");

    await Aminity.findByIdAndDelete(aminityId).lean().exec();

    res.status(200).json({ message: "Aminity Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
