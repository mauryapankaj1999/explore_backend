import { BANNER_STATUS } from "common/constant.common";
import { NextFunction, Request, Response } from "express";
import { Banner } from "models/banner.model";
import { PipelineStage } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";

/* ADMIN */
export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { image, title, largeTitle, status, url } = req.body;

    let requiredFields: any = {
      URL: url,
      Image: image,
      Title: title,
      Caption: largeTitle,
    };

    verifyRequiredFields(requiredFields);

    image = await storeFileAndReturnNameBase64(image);

    const newObj = {
      image,
      title,
      largeTitle,
      url,
      status,
    };

    await Banner.create(newObj);

    res.status(200).json({ message: "Successfully created Banner" });
  } catch (error) {
    next(error);
  }
};

export const getBanner = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(Banner, pipeline, req.query);
    res.status(200).json({ message: "Banner list", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find banner");

    const banner = await Banner.findById(id).lean().exec();

    if (!banner) throw new Error("Can't find banner");

    res.status(200).json({ message: "Banner By Id", data: banner });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find banner");

    const banner = await Banner.findById(id).lean().exec();

    if (!banner) throw new Error("Can't find banner");

    let { url, image, status, title, largeTitle } = req.body;

    let updateObj: any = {};

    if (url) {
      updateObj.url = url;
    }

    if (image) {
      updateObj.image = await storeFileAndReturnNameBase64(image);
    }

    if (status) {
      updateObj.status = status;
    }

    if (title) {
      updateObj.title = title;
    }

    if (largeTitle) {
      updateObj.largeTitle = largeTitle;
    }
    await Banner.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Banner Updated" });
  } catch (error) {
    next(error);
  }
};

export const updateBannerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bannerId } = req.query;

    if (!bannerId) throw new Error("Can't found banner");

    const banner = await Banner.findById(bannerId).lean().exec();

    if (!banner) throw new Error("Can't found banner");

    await Banner.findByIdAndUpdate(bannerId, req.body);
    res.status(200).json({ message: "Banner status updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bannerId } = req.query;

    if (!bannerId) throw new Error("Can't found banner");

    const banner: any = await Banner.findById(bannerId).lean().exec();

    if (!banner) throw new Error("Can't found banner");

    await Banner.findByIdAndDelete(bannerId);
    res.status(200).json({ message: "Banner deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

/* 
For user side 
*/
/* USER */
export const getActiveBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.aggregate([
      { $match: { status: BANNER_STATUS.ACTIVE } },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).json({ message: "Active Banner", data: banner });
  } catch (error) {
    next(error);
  }
};
