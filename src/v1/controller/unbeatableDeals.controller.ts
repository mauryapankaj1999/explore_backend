import { NextFunction, Request, Response } from "express";
import { UnbeatableDeal } from "models/unbeatableDeals.model";
import { PipelineStage, Types } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";
import { createSlug, generateUniqueSlug } from "utils/slug";

/* ADMIN */
export const createUnbeatableDeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { title, tagline, image, offerPercentage, order } = req.body;

    const requiredFields: any = {
      Title: title,
      Cover_Image: image,
      Offer_Percentage: offerPercentage,
      Order: order,
    };

    verifyRequiredFields(requiredFields);

    if (image) {
      image = await storeFileAndReturnNameBase64(image);
    }

    const existOrder = await UnbeatableDeal.findOne({ order: Number(order) })
      .lean()
      .exec();
    if (existOrder) {
      await UnbeatableDeal.findByIdAndUpdate(existOrder?._id, { order: 0 });
    }

    const baseSlug = createSlug(title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, UnbeatableDeal);

    const newObj: any = {
      title,
      tagline,
      image,
      slug: uniqueSlug,
      offerPercentage,
      order: Number(order),
    };

    await UnbeatableDeal.create(newObj);

    res.status(200).json({ message: "Successfully Created new Unbeatable deal" });
  } catch (error) {
    next(error);
  }
};
export const getUnbeatableDeals = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(UnbeatableDeal, pipeline, req.query);
    res.status(200).json({ message: "All Unbeatable Deals.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
export const updateUnbeatableDealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Unbeatable deal");

    const unbeatableDeals = await UnbeatableDeal.findById(id).lean().exec();

    if (!unbeatableDeals) throw new Error("Can't find Unbeatable deal");

    let { title, tagline, image, offerPercentage, order } = req.body;

    let updateObj: any = {};

    if (image) {
      updateObj.image = await storeFileAndReturnNameBase64(image);
    }

    if (title) {
      updateObj.title = title;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (offerPercentage) {
      updateObj.offerPercentage = offerPercentage;
    }

    if (order) {
      const existSameOrder = await UnbeatableDeal.findOne({
        order: Number(order),
        _id: { $ne: new Types.ObjectId(id) },
      })
        .lean()
        .exec();
      if (existSameOrder) {
        await UnbeatableDeal.findByIdAndUpdate(existSameOrder?._id, { order: 0 });
      }
      updateObj.order = Number(order);
    }

    await UnbeatableDeal.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Unbeatable deals updated Successfully" });
  } catch (error) {
    next(error);
  }
};
export const getUnbeatableDealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Unbeatable deal");

    const unbeatableDeals = await UnbeatableDeal.findById(id).lean().exec();

    if (!unbeatableDeals) throw new Error("Can't find Unbeatable deal");

    res.status(200).json({ message: "Unbeatable deals by id", data: unbeatableDeals });
  } catch (error) {
    next(error);
  }
};
export const updateViewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dealId } = req.query;
    if (!dealId) throw new Error("Can't find Deal");

    const deal = await UnbeatableDeal.findById(dealId).lean().exec();

    if (!deal) throw new Error("Can't find Deal");

    await UnbeatableDeal.findOneAndUpdate({ order: Number(req.body.order) }, { order: 0 });

    await UnbeatableDeal.findByIdAndUpdate(dealId, { order: Number(req.body.order) });

    res.status(200).json({ message: "Deal is updated." });
  } catch (error) {
    next(error);
  }
};

export const deleteUnbeatableDeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dealId } = req.query;

    if (!dealId) throw new Error("Can't found Deal");

    const exist = await UnbeatableDeal.findById(dealId).lean().exec();

    if (!exist) throw new Error("Can't found Unbeatable Deal");

    await UnbeatableDeal.findByIdAndDelete(dealId).lean().exec();

    res.status(200).json({ message: "Unbeatable Deal Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* ADMIN */
export const getUnbeatableDealsForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("UNBEATABLE DEALSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
    let matchObj: Record<string, any> = { order: { $gte: 1 } };
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

    const paginated = await paginateAggregate(UnbeatableDeal, pipeline, req.query);
    res.status(200).json({ message: "All Unbeatable Deals.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
