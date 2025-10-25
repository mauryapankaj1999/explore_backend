import { NextFunction, Request, Response } from "express";
import { Place } from "models/place.model";
import { Package } from "models/package.model";
import { PipelineStage, Types } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { paginateAggregate } from "utils/paginateAggregate";
import { newRegExp } from "utils/regex";
import { createSlug, generateUniqueSlug } from "utils/slug";

/* ADMIN */
export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      name,
      title,
      cover,
      image,
      // countryId,
      placeId,
      tagline,
      description,
      day,
      night,
      includes,
      inclusion,
      exclusion,
      iteneries,
      price,
      type,
      destinationType,
      metaTitle,
      metaDescription,
      seoOverView,
      // activities,
    } = req.body;

    if (!includes || !includes?.length) {
      includes = undefined;
    }
    if (!inclusion || !inclusion?.length) {
      inclusion = undefined;
    }
    if (!exclusion || !exclusion?.length) {
      exclusion = undefined;
    }
    if (!iteneries || !iteneries?.length) {
      iteneries = undefined;
    }
    // if (!activities || !activities?.length) {
    //   activities = undefined;
    // }

    // if (typeof countryId === "string" && destinationType === PACKAGE_DESTINATION.INTERNATIONAL) {
    //   const existPackage = await Package.findOne({
    //     name: newRegExp(name, "i"),
    //     countryId: new Types.ObjectId(countryId),
    //   });
    //   if (existPackage) throw new Error("Package in this name is already exist.");
    // }

    // if (typeof placeId === "string" && destinationType === PACKAGE_DESTINATION.DOMESTIC) {
    const existPackage = await Package.findOne({
      name: newRegExp(name, "i"),
      placeId: new Types.ObjectId(placeId),
    });
    if (existPackage) throw new Error("Package in this name is already exist.");
    // }

    const requiredFields: any = {
      Name: name,
      Title: title,
      Image: image,
      Cover_Image: cover,
      Tagline: tagline,
      Description: description,
      Day: day,
      Night: night,
      Includes: includes,
      Inclusions: inclusion,
      Exclusions: exclusion,
      Iteneries: iteneries,
      Price: price,
      Place: placeId,
      Type: type,
      // Activities: activities,
      // Country_ID: countryId,
    };

    verifyRequiredFields(requiredFields);

    // let exist: any = null;

    // if (destinationType === PACKAGE_DESTINATION.INTERNATIONAL) {
    //   exist = await Place.findById(countryId).lean().exec();

    //   if (!exist) throw new Error("Can't found country !");
    // }

    // if (destinationType === PACKAGE_DESTINATION.DOMESTIC) {
    //   exist = await Place.findById(placeId).lean().exec();

    //   if (!exist) throw new Error("Can't found Place !");
    // }

    let place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't found Place !");

    // if (includes && includes?.length > 0) {
    //   for (const el of includes) {
    //     el.image = await storeFileAndReturnNameBase64(el?.image);
    //   }
    // }

    // if (activities && activities?.length > 0) {
    //   activities.forEach(async (el: any) => {
    //     el.image = await storeFileAndReturnNameBase64(el?.image);
    //   });
    // }

    cover = await storeFileAndReturnNameBase64(cover);
    image = await storeFileAndReturnNameBase64(image);

    const baseSlug = createSlug(name);
    const uniqueSlug = await generateUniqueSlug(baseSlug, Package);

    console.log(place, "PLACE");
    const newObj = {
      name,
      slug: uniqueSlug,
      title,
      cover,
      image,
      placeId,
      placeName: place ? place?.name : undefined,
      // countryId: place?.countryId ? place?.countryId : undefined,
      // countryName: place?.countryName ? place?.countryName : undefined,
      tagline,
      description,
      day,
      night,
      includes,
      inclusion,
      exclusion,
      iteneries,
      price,
      type,
      destinationType,
      // activities,
      metaTitle,
      metaDescription,
      seoOverView,
    };

    await Package.create(newObj);
    res.status(200).json({ message: "Successfully created package" });
  } catch (error) {
    next(error);
  }
};

export const getPackages = async (req: Request, res: Response, next: NextFunction) => {
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
          localField: "countryId",
          foreignField: "_id",
          as: "countryInfo",
        },
      },
      {
        $unwind: {
          path: "$countryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          countryName: "$countryInfo.name",
        },
      },
      {
        $project: {
          countryInfo: 0,
        },
      },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
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
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Package, pipeline, req.query);

    res.status(200).json({ message: "All Packages.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const updatePackageToggles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { packageId } = req.query;

    if (!packageId) throw new Error("Can't find Package");

    const packag = await Package.findById(packageId).lean().exec();

    if (!packag) throw new Error("Can't find Package");

    await Package.findByIdAndUpdate(packageId, req.body);

    res.status(200).json({ message: "Package updated." });
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { packageId } = req.query;

    if (!packageId) throw new Error("Can't found package");

    const exist = await Package.findById(packageId).lean().exec();

    if (!exist) throw new Error("Can't found package");

    await Package.findByIdAndDelete(packageId).lean().exec();

    res.status(200).json({ message: "Package Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPackageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Package");

    const packag = await Package.findById(id).lean().exec();

    if (!packag) throw new Error("Can't find package");

    res.status(200).json({ message: "package By Id", data: packag });
  } catch (error) {
    next(error);
  }
};

export const updatePackageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Package");

    const packag = await Package.findById(id).lean().exec();

    if (!packag) throw new Error("Can't find package");

    let {
      name,
      title,
      cover,
      image,
      // countryId,
      placeId,
      tagline,
      description,
      day,
      night,
      includes,
      inclusion,
      exclusion,
      iteneries,
      price,
      type,
      destinationType,
      // activities,
      metaTitle,
      metaDescription,
      seoOverView,
    } = req.body;

    let updateObj: any = {};

    if (seoOverView) {
      updateObj.seoOverView = seoOverView;
    }

    if (metaTitle) {
      updateObj.metaTitle = metaTitle;
    }

    if (metaDescription) {
      updateObj.metaDescription = metaDescription;
    }

    if (name) {
      updateObj.name = name;
    }

    if (title) {
      updateObj.title = title;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (description) {
      updateObj.description = description;
    }

    if (day) {
      updateObj.day = day;
    }

    if (night) {
      updateObj.night = night;
    }

    if (price) {
      updateObj.price = price;
    }

    if (type) {
      updateObj.type = type;
    }

    if (destinationType) {
      updateObj.destinationType = destinationType;
    }

    let place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't found Place !");

    updateObj.placeId = placeId;
    updateObj.placeName = place ? place?.name : undefined;

    // if (place?.countryId) {
    //   updateObj.countryId = place?.countryId;
    // }
    // if (place?.countryName) {
    //   updateObj.countryName = place?.countryName;
    // }

    if (includes && includes?.length) {
      // for (const el of includes) {
      //   if (el?.updated) {
      //     el.image = await storeFileAndReturnNameBase64(el?.image);
      //   }
      // }

      updateObj.includes = includes;
    }
    if (inclusion && inclusion?.length) {
      updateObj.inclusion = inclusion;
    }
    if (exclusion && exclusion?.length) {
      updateObj.exclusion = exclusion;
    }
    if (iteneries && iteneries?.length) {
      updateObj.iteneries = iteneries;
    }
    // if (activities && activities?.length) {
    //   activities.forEach(async (el: any) => {
    //     if (el?.updated) {
    //       el.image = await storeFileAndReturnNameBase64(el?.image);
    //     }
    //   });
    //   updateObj.activities = activities;
    // }

    const existPackage = await Package.findOne({
      name: newRegExp(name, "i"),
      placeId: new Types.ObjectId(placeId),
      _id: { $ne: new Types.ObjectId(id) },
    });
    if (existPackage) throw new Error("Package in this name is already exist.");

    if (cover) {
      cover = await storeFileAndReturnNameBase64(cover);
      updateObj.cover = cover;
    }
    if (image) {
      image = await storeFileAndReturnNameBase64(image);
      updateObj.image = image;
    }

    if (name !== packag?.name) {
      const baseSlug = createSlug(name);
      const uniqueSlug = await generateUniqueSlug(baseSlug, Package);
      updateObj.slug = uniqueSlug;
    }

    console.log(updateObj, "UPDATE OBJ ");
    await Package.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "Package Updated successfully" });
  } catch (error) {
    next(error);
  }
};

/* USER */

export const getPackagesForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    const { destinationType, isTopTrending, placeId } = req.query;

    if (typeof destinationType === "string") {
      matchObj.destinationType = destinationType;
    }

    if (typeof isTopTrending === "string") {
      matchObj.isTopTrending = Boolean(isTopTrending);
    }

    if (typeof placeId === "string") {
      matchObj.placeId = new Types.ObjectId(placeId);
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $lookup: {
          from: "places",
          localField: "countryId",
          foreignField: "_id",
          as: "countryInfo",
        },
      },
      {
        $unwind: {
          path: "$countryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          countryName: "$countryInfo.name",
        },
      },
      {
        $project: {
          countryInfo: 0,
        },
      },
      {
        $lookup: {
          from: "places",
          localField: "placeId",
          foreignField: "_id",
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
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Package, pipeline, req.query);

    res.status(200).json({ message: "All Packages.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getPackageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (!slug) throw new Error("Can't find Package !");
    const packag = await Package.findOne({ slug: slug }).lean().exec();
    if (!packag) throw new Error("Can't find Package !");
    res.status(200).json({ message: "Single Package", data: packag });
  } catch (error) {
    next(error);
  }
};

export const getPackageByPlaceId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    const { placeId, type } = req.query;

    if (placeId && typeof placeId === "string") {
      matchObj.placeId = new Types.ObjectId(placeId);
    }

    if (type && typeof type === "string") {
      matchObj.type = type;
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Package, pipeline, req.query);

    res.status(200).json({ message: "All Packages for the place.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
