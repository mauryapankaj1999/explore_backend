import { NextFunction, Request, Response } from "express";
import { Partners } from "models/partners.model";
import { PipelineStage } from "mongoose";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

export const createPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { logo } = req.body;

    if (!logo) throw new Error("Logo is required");

    logo = await storeFileAndReturnNameBase64(logo);

    await Partners.create({ logo });
    res.status(201).json({ message: "Partners Created" });
  } catch (error) {
    next(error);
  }
};
export const getPartners = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(Partners, pipeline, req.query);

    res.status(200).json({ message: "All Partners.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
export const getPartnerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Partner");

    const partner = await Partners.findById(id).lean().exec();

    if (!partner) throw new Error("Can't find Partner");

    res.status(200).json({ message: "partner By Id", data: partner });
  } catch (error) {
    next(error);
  }
};
export const updatePartnerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Partner");

    const partner = await Partners.findById(id).lean().exec();

    if (!partner) throw new Error("Can't find Partner");

    let { logo } = req.body;

    let updateObj: any = {};

    if (logo) {
      logo = await storeFileAndReturnNameBase64(logo);
      updateObj.logo = logo;
    }

    await Partners.findByIdAndUpdate(id, updateObj);
    res.status(200).json({ message: "Partner updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deletePartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { partnersId } = req.query;

    if (!partnersId) throw new Error("Can't found Partners");
    const exist = await Partners.findById(partnersId).lean().exec();

    if (!exist) throw new Error("Can't found Partners");

    await Partners.findByIdAndDelete(partnersId).lean().exec();

    res.status(200).json({ message: "Partners Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
