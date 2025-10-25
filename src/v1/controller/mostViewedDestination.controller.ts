import { NextFunction, Request, Response } from "express";
import { MostViewedDestination } from "models/mostViewedDestination.model";
import { PipelineStage, Types } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";
import { createSlug, generateUniqueSlug } from "utils/slug";

/* ADMIN */
export const createMostViewedDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { title, image, tagline, order, url } = req.body;

    let requiredFields: any = {
      Title: title,
      Cover_Image: image,
      Order: order,
    };

    verifyRequiredFields(requiredFields);

    if (image) {
      image = await storeFileAndReturnNameBase64(image);
    }

    const existWithOrder = await MostViewedDestination.findOne({ order: order }).lean().exec();

    if (existWithOrder) {
      await MostViewedDestination.findByIdAndUpdate(existWithOrder?._id, { order: 0 });
    }

    const baseSlug = createSlug(title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, MostViewedDestination);

    const newObj: any = {
      title,
      image,
      url,
      tagline,
      slug: uniqueSlug,
      order: Number(order),
    };

    await MostViewedDestination.create(newObj);

    res.status(200).json({ message: "Successfully created new Most viewed destination" });
  } catch (error) {
    next(error);
  }
};
export const getMostViewedDestination = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(MostViewedDestination, pipeline, req.query);
    res.status(200).json({ message: "All Most Viewed Destinations.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
export const getMostViewedDestinationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Most viewed Destination");

    const mostViewedDestination = await MostViewedDestination.findById(id).lean().exec();

    if (!mostViewedDestination) throw new Error("Can't find Most viewed destination");

    res.status(200).json({ message: "Destination By Id", data: mostViewedDestination });
  } catch (error) {
    next(error);
  }
};
export const updateMostViewedDestinationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Most viewed Destination");

    const mostViewedDestination = await MostViewedDestination.findById(id).lean().exec();

    if (!mostViewedDestination) throw new Error("Can't find Most viewed destination");

    let { title, image, tagline, order, url } = req.body;

    let updateObj: any = {};

    if (image) {
      image = await storeFileAndReturnNameBase64(image);
      updateObj.image = image;
    }

    if (title) {
      updateObj.title = title;
    }

    if (url) {
      updateObj.url = url;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (order) {
      updateObj.order = order;
    }

    const existWithOrder = await MostViewedDestination.findOne({ order: order, _id: { $ne: new Types.ObjectId(id) } })
      .lean()
      .exec();

    if (existWithOrder) {
      await MostViewedDestination.findByIdAndUpdate(existWithOrder?._id, { order: 0 });
    }

    await MostViewedDestination.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Most viewed Destination updated Successfully" });
  } catch (error) {
    next(error);
  }
};
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mostViewedDestinationId }: any = req.query;

    if (!mostViewedDestinationId || typeof mostViewedDestinationId !== "string")
      throw new Error("Can't find Most viewed destination. Invalid Id! ");

    const mostViewedDestination = await MostViewedDestination.findById(mostViewedDestinationId).lean().exec();

    if (!mostViewedDestination) throw new Error("Can't find Most viewed destination.");

    const sameOrder = await MostViewedDestination.findOne({
      order: Number(req.body.order),
      _id: { $ne: new Types.ObjectId(mostViewedDestinationId) },
    })
      .lean()
      .exec();

    if (sameOrder) {
      await MostViewedDestination.findByIdAndUpdate(sameOrder?._id, {
        order: 0,
      });
    }
    await MostViewedDestination.findByIdAndUpdate(mostViewedDestinationId, {
      order: Number(req.body.order),
    });

    res.status(200).json({ message: "Order updated " });
  } catch (error) {
    next(error);
  }
};
export const deleteMostViewedDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mostViewedDestinationId } = req.query;

    if (!mostViewedDestinationId) throw new Error("Can't find Most viewed destination. Invalid Id! ");

    const mostViewedDestination = await MostViewedDestination.findById(mostViewedDestinationId).lean().exec();

    if (!mostViewedDestination) throw new Error("Can't find Most viewed destination.");

    await MostViewedDestination.findByIdAndDelete(mostViewedDestinationId);
    res.status(200).json({ message: "Most viewed destinatino deleted successfully " });
  } catch (error) {
    next(error);
  }
};

/* USER */
export const getMostViewedDestinationForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { order: 1 },
      },
      {
        $limit: 4,
      },
    ];

    const paginated = await paginateAggregate(MostViewedDestination, pipeline, req.query);
    res.status(200).json({ message: "All Most Viewed Destinations.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
