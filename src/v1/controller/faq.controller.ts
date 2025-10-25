import { NextFunction, Request, Response } from "express";
import { Place } from "models/place.model";
import { Faq } from "models/faq.model";
import { PipelineStage, Types } from "mongoose";
import { paginateAggregate } from "utils/paginateAggregate";
import { Package } from "models/package.model";

/* ADMIN */
export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { placeId, questions } = req.body;
    console.log(req.body, "FAQ BODY");
    if (!placeId) throw new Error("Can't find Place!");

    const existPlace = await Place.findById(placeId).lean().exec();

    if (!existPlace) throw new Error("Can't find Place!");

    if (!questions || !questions?.length) throw new Error("Atleast one question required!");

    await Faq.create({ ...req.body, placeName: existPlace?.name });

    res.status(200).json({ message: "Successfully created FAQ" });
  } catch (error) {
    next(error);
  }
};

export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $lookup: {
          from: "places",
          foreignField: "_id",
          localField: "placeId",
          as: "placeInfo",
        },
      },
      {
        $unwind: {
          path: "$placeInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          placeName: "$placeInfo.name",
        },
      },
      {
        $project: {
          placeInfo: 0,
        },
      },
    ];

    const paginated = await paginateAggregate(Faq, pipeline, req.query);
    res.status(200).json({ message: "FAQ list", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { faqId } = req.query;

    if (!faqId) throw new Error("Can't found Faq");

    const faq = await Faq.findById(faqId).lean().exec();

    if (!faq) throw new Error("Can't found Faq");

    await Faq.findByIdAndDelete(faqId).lean().exec();

    res.status(200).json({ message: "Faq Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id }: any = req.params;

    if (!id) throw new Error("Faq Id not valid !");

    const faq = await Faq.findById(id).lean().exec();

    if (!faq) throw new Error("Can't found faq !");

    res.status(200).json({ message: "Faq for package", data: faq });
  } catch (error) {
    next(error);
  }
};

export const updateFaqById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id }: any = req.params;

    if (!id) throw new Error("Faq Id not valid !");

    const faq = await Faq.findById(id).lean().exec();

    if (!faq) throw new Error("Can't found faq !");

    let { placeId, questions } = req.body;

    let updateObj: any = { questions };

    if (placeId) {
      let existPlace = await Place.findById(placeId).lean().exec();

      if (!existPlace) throw new Error("Can't find Place!");

      if (!faq?.placeId || faq?.placeId.toString() !== placeId) {
        updateObj.placeId = placeId;
        updateObj.placeName = existPlace?.name;
      }
    }

    await Faq.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Faq for package", data: faq });
  } catch (error) {
    next(error);
  }
};

/* USER */
export const getFaqForPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId }: any = req.query;

    if (!placeId) throw new Error("Place Id not valid !");

    const place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't found place !");

    let faq = null;

    if (typeof placeId === "string") {
      faq = await Faq.findOne({ placeId: new Types.ObjectId(placeId) });
    }

    res.status(200).json({ message: "Faq for place", data: faq });
  } catch (error) {
    next(error);
  }
};
