import { NextFunction, Request, Response } from "express";
import { GroupTour } from "models/groupTour.model";
import { PipelineStage, Types } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

/* ADMIN */

export const createGroupTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      title,
      tagline,
      benefits,
      // status,
      banner,
    } = req.body;

    const requiredFields: any = {
      Title: title,
      Banner: banner,
      Tagline: tagline,
      Benefits: benefits,
    };

    verifyRequiredFields(requiredFields);

    if (benefits && benefits?.length > 0) {
      for (const el of benefits) {
        el.image = await storeFileAndReturnNameBase64(el?.image);
      }
    }

    if (banner) {
      banner = await storeFileAndReturnNameBase64(banner);
    }

    const newObj = {
      title,
      banner,
      tagline,
      benefits,
    };

    await GroupTour.create(newObj);

    res.status(200).json({ message: "Successfully created Group Tour" });
  } catch (error) {
    next(error);
  }
};
export const getGroupTour = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(GroupTour, pipeline, req.query);
    res.status(200).json({ message: "All Group Tour.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
export const getGroupTourById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find group tour");

    const grouptour = await GroupTour.findById(id).lean().exec();

    if (!grouptour) throw new Error("Can't find grouptour");

    res.status(200).json({ message: "Group Tour by id", data: grouptour });
  } catch (error) {
    next(error);
  }
};
export const updateGroupTourById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find group tour");

    const grouptour = await GroupTour.findById(id).lean().exec();

    if (!grouptour) throw new Error("Can't find grouptour");

    let {
      title,
      tagline,
      benefits,
      // status,
      banner,
    } = req.body;

    let updateObj: any = {};

    if (title) {
      updateObj.title = title;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (benefits && benefits?.length > 0) {
      console.log(benefits && benefits?.length > 0, "benefits && benefits?.length > 0");
      for (const el of benefits) {
        if (el?.updated) {
          el.image = await storeFileAndReturnNameBase64(el?.image);
        }
      }
      updateObj.benefits = benefits;
    }

    if (banner) {
      updateObj.banner = await storeFileAndReturnNameBase64(banner);
    }

    console.log(updateObj, "UPDATE OBJ");

    await GroupTour.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Group Tour updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const updateGroupTourStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupTourId }: any = req.query;

    if (!groupTourId) throw new Error("Can't find Group Tour");

    const groupTour = await GroupTour.findById(groupTourId).lean().exec();

    if (!groupTour) throw new Error("Can't find Group Tour");

    if (req.body.status) {
      const existStatus = await GroupTour.findOne({ status: true, _id: { $ne: new Types.ObjectId(groupTourId) } })
        .lean()
        .exec();

      if (existStatus) {
        await GroupTour.findByIdAndUpdate(existStatus?._id, { status: !existStatus?.status });
      }
    }

    await GroupTour.findByIdAndUpdate(groupTourId, req.body);

    res.status(200).json({ message: "Group Tour updated." });
  } catch (error) {
    next(error);
  }
};
export const deleteGroupTour = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupTourId } = req.query;

    if (!groupTourId) throw new Error("Can't find Group Tour! ");

    const groupTour = await GroupTour.findById(groupTourId).lean().exec();

    if (!groupTour) throw new Error("Can't find Group Tour.");

    await GroupTour.findByIdAndDelete(groupTourId);
    res.status(200).json({ message: "Group Tour deleted successfully " });
  } catch (error) {
    next(error);
  }
};

/* USER */

export const getActiveGroupTourForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupTour = await GroupTour.findOne({ status: true }).lean().exec();
    res.status(200).json({ message: "Active Group Tour", data: groupTour });
  } catch (error) {
    next(error);
  }
};
