import { DESTINATION } from "common/constant.common";
import { NextFunction, Request, Response } from "express";
import { update } from "lodash";
import { Destination } from "models/destination.model";
import { Place } from "models/place.model";
import { PipelineStage, Types } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";
import { newRegExp } from "utils/regex";
import { createSlug, generateUniqueSlug } from "utils/slug";

/* ADMIN */
export const createDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, description, cover, placeId, type, metaData } = req.body;

    const requiredFields: any = {
      Name: name,
      Description: description,
      Cover_image: cover,
      Place_ID: placeId,
      Type: type,
      "Meta Title": metaData?.title,
      "Meta Description": metaData?.description,
    };

    verifyRequiredFields(requiredFields);

    const existPlace = await Place.findById(placeId).lean().exec();

    if (!existPlace) throw new Error("Can't find place!");

    const existDestination = await Destination.findOne({
      name: newRegExp(name, "i"),
      placeId: new Types.ObjectId(placeId),
    });
    if (existDestination) throw new Error("Destination in this name is already exist.");

    let placeName = existPlace?.name;

    cover = await storeFileAndReturnNameBase64(cover);

    let baseSlug = createSlug(name);
    let uniqueSlug = await generateUniqueSlug(baseSlug, Destination);

    const newObj = {
      ...req.body,
      cover,
      placeName,
      slug: uniqueSlug,
    };

    await Destination.create(newObj);

    res.status(200).json({ message: "Successfully created new destination." });
  } catch (error) {
    next(error);
  }
};

export const getDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    if (typeof req.query.placeId === "string") {
      matchObj.placeId = new Types.ObjectId(req.query.placeId);
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Destination, pipeline, req.query);
    res.status(200).json({ message: "Destination list", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getDestinationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find destination");

    const destination = await Destination.findById(id).lean().exec();

    if (!destination) throw new Error("Can't find destination");

    res.status(200).json({ message: "Destination By Id", data: destination });
  } catch (error) {
    next(error);
  }
};

export const updateDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find destination");

    const destination = await Destination.findById(id).lean().exec();

    if (!destination) throw new Error("Can't find destination");

    let { name, description, cover, placeId, type, metaData } = req.body;

    let updateObj: any = {};

    if (metaData?.title) {
      updateObj.metaData.title = metaData?.title;
    }

    if (metaData?.description) {
      updateObj.metaData.description = metaData?.description;
    }

    if (name) {
      updateObj.name = name;
    }

    if (description) {
      updateObj.description = description;
    }

    if (description) {
      updateObj.description = description;
    }

    if (type) {
      updateObj.type = type;
    }

    if (placeId) {
      updateObj.placeId = placeId;
    }

    if (cover) {
      updateObj.cover = await storeFileAndReturnNameBase64(cover);
    }

    await Destination.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Destination updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId } = req.query;

    if (!destinationId) throw new Error("Can't found Destination");

    const destination = await Destination.findById(destinationId).lean().exec();

    if (!destination) throw new Error("Can't found Destination");

    await Destination.findByIdAndDelete(destinationId).lean().exec();

    res.status(200).json({ message: "Destination Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* USER  */

export const getDestinationsForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    const { placeId } = req.query;

    if (placeId && typeof placeId === "string") {
      matchObj.placeId = new Types.ObjectId(placeId);
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Destination, pipeline, req.query);
    res.status(200).json({ message: "Destination list", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getDestinationsForPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId } = req.query;

    if (!placeId || typeof placeId !== "string") throw new Error("Can't found place");

    const destinations = await Destination.aggregate([
      {
        $match: { placeId: new Types.ObjectId(placeId) },
      },
    ]);

    res.status(200).json({ message: "Destinatinon", data: destinations });
  } catch (error) {
    next(error);
  }
};
