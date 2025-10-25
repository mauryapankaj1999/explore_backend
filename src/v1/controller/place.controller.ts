import { NextFunction, Request, Response } from "express";
import { Place } from "../../models/place.model";
import { storeFileAndReturnNameBase64 } from "utils/fileSystem";
import { PipelineStage, Types } from "mongoose";
import { paginateAggregate } from "utils/paginateAggregate";
import { verifyRequiredFields } from "utils/error";
import { newRegExp } from "utils/regex";
import { PLACE } from "common/constant.common";
import { createSlug, generateUniqueSlug } from "utils/slug";

/* ADMIN */
export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body.title, req.body.description, "meta data");
    let {
      name,
      coverImage: cover,
      startingPackagePrice,
      image,
      type, //International or domestic
      // countryId, // if the type of place is Domestice then countryId and countryName is required
      tagline,
      aboutPlace: about,
      aboutTitle,
      aboutImage,
      mustFollows,
      avoidThings,
      title,
      description,
      // thingsTodo: thingsToDoDescription,
      thingsTodoArr,
    } = req.body;

    const existPlace = await Place.findOne({ name: newRegExp(name, "i") });

    if (existPlace) throw new Error("Place in this name is already exists!");

    // if (!mustFollows || !mustFollows?.length) {
    //   mustFollows = undefined;
    // }

    // if (!avoidThings || !avoidThings?.length) {
    //   avoidThings = undefined;
    // }

    if (!thingsTodoArr || !thingsTodoArr?.length) {
      thingsTodoArr = undefined;
    }

    const requiredFields: any = {
      Name: name,
      Type: type,
      Starting_Package: startingPackagePrice,
      Cover_Image: cover,
      Tag_line: tagline,
      About: about,
      About_Title: aboutTitle,
      About_Image: aboutImage,
      // Things_to_do_description: thingsToDoDescription,
      // Must_Follows: mustFollows,
      // Avoid_Things: avoidThings,
      Things_to_do: thingsTodoArr,
    };

    // if (type === PLACE.DOMESTIC) {
    //   requiredFields.Country_ID = countryId;
    // }

    verifyRequiredFields(requiredFields);

    // let country = null;

    // if (type === PLACE.DOMESTIC) {
    //   country = await Place.findById(countryId).lean().exec();
    //   if (!country) throw new Error("Can't find Country !");
    // }

    if (thingsTodoArr && thingsTodoArr?.length > 0) {
      thingsTodoArr.forEach(async (el: any) => {
        el.image = await storeFileAndReturnNameBase64(el?.image);
      });
    }

    cover = await storeFileAndReturnNameBase64(cover);
    aboutImage = await storeFileAndReturnNameBase64(aboutImage);
    image = await storeFileAndReturnNameBase64(image);

    const baseSlug = createSlug(name);
    const uniqueSlug = await generateUniqueSlug(baseSlug, Place);

    const newObj = {
      ...req.body,
      thingsTodoArr,
      aboutImage,
      // countryName: country ? country?.name : undefined,
      image,
      cover,
      about,
      startingPackagePrice,
      slug: uniqueSlug,
    };

    await Place.create(newObj);

    res.status(200).json({ message: "Successfully created Place" });
  } catch (error) {
    next(error);
  }
};

export const getPlaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    const { type, countryId } = req.query;

    if (type && typeof type === "string") {
      matchObj.type = type;
    }

    if (countryId && typeof countryId === "string") {
      matchObj.countryId = new Types.ObjectId(countryId);
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(Place, pipeline, req.query);
    res.status(200).json({ message: "All Places.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const updatePlaceToggles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId } = req.query;

    if (!placeId) throw new Error("Can't find Place");

    const place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't find Place");

    let missingOrder = null;

    let updateObj: any = {};

    if (req.body.isTopDestination) {
      const isTopDestinationList = await Place.aggregate([{ $match: { isTopDestination: true } }]);

      if (isTopDestinationList?.length === 5) throw new Error("Already 5 top destination exist !");

      if (isTopDestinationList?.length) {
        const orders = isTopDestinationList?.map((des: any) => des.isTopDestinationOrder).sort();
        if (orders?.length) {
          for (let i = 0; i < 5; i++) {
            if (orders[i] !== i + 1) {
              missingOrder = i + 1;
              break;
            }
          }
        }
      }
      updateObj.isTopDestinationOrder = missingOrder;
      updateObj.isTopDestination = req.body.isTopDestination;
    } else if (!req.body.isTopDestination) {
      updateObj.isTopDestinationOrder = null;
      updateObj.isTopDestination = req.body.isTopDestination;
    }

    if (req.body.showInMenu || !req.body.showInMenu) {
      updateObj.showInMenu = req.body.showInMenu;
    }

    await Place.findByIdAndUpdate(placeId, updateObj);

    res.status(200).json({ message: "Place updated." });
  } catch (error) {
    next(error);
  }
};

export const updateIsTopDestinationOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId }: any = req.query;

    if (!placeId) throw new Error("Can't find Place");

    const place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't find Place");

    let sameOrder = await Place.findOne({
      isTopDestinationOrder: Number(req.body.isTopDestinationOrder),
      _id: { $ne: new Types.ObjectId(placeId) },
    })
      .lean()
      .exec();

    if (sameOrder) {
      let missingOrder = null;

      const isTopDestinationList = await Place.aggregate([{ $match: { isTopDestination: true } }]);

      if (isTopDestinationList?.length) {
        const orders = isTopDestinationList?.map((des: any) => des.isTopDestinationOrder).sort();
        if (orders?.length) {
          for (let i = 0; i < 5; i++) {
            if (orders[i] !== i + 1) {
              missingOrder = i + 1;
              break;
            }
          }
        }
      }

      await Place.findByIdAndUpdate(sameOrder?._id, {
        isTopDestinationOrder: missingOrder,
      });
    }

    await Place.findByIdAndUpdate(placeId, {
      isTopDestinationOrder: Number(req.body.isTopDestinationOrder),
    });

    res.status(200).json({ message: "Place updated." });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { placeId } = req.query;

    if (!placeId) throw new Error("Can't find Place! ");

    const place = await Place.findById(placeId).lean().exec();

    if (!place) throw new Error("Can't find Place.");

    await Place.findByIdAndDelete(placeId);
    res.status(200).json({ message: "Place deleted successfully " });
  } catch (error) {
    next(error);
  }
};

export const udpatePlaceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Place");

    const place = await Place.findById(id).lean().exec();

    if (!place) throw new Error("Can't find place");

    console.log(req.body, "BODY");
    let {
      name,
      coverImage: cover,
      startingPackagePrice,
      image,
      type, //International or domestic
      // countryId, // if the type of place is Domestice then countryId and countryName is required
      tagline,
      aboutPlace: about,
      aboutTitle,
      aboutImage,
      // mustFollows,
      // avoidThings,
      // thingsTodo: thingsToDoDescription,
      thingsTodoArr,
      title,
      description,
      dropdownTitle,
    } = req.body;

    const existPlace = await Place.findOne({ name: newRegExp(name, "i"), _id: { $ne: new Types.ObjectId(id) } });

    if (existPlace) throw new Error("Place in this name is already exists!");

    let updateObj: any = {};

    if (title) {
      updateObj.title = title;
    }

    if (description) {
      updateObj.description = description;
    }

    if (type) {
      updateObj.type = type;
    }

    if (name) {
      updateObj.name = name;
    }

    if (about) {
      updateObj.about = about;
    }

    if (startingPackagePrice) {
      updateObj.startingPackagePrice = startingPackagePrice;
    }

    if (aboutTitle) {
      updateObj.aboutTitle = aboutTitle;
    }

    if (tagline) {
      updateObj.tagline = tagline;
    }

    if (dropdownTitle) {
      updateObj.dropdownTitle = dropdownTitle;
    }

    // if (mustFollows && mustFollows?.length) {
    //   updateObj.mustFollows = mustFollows;
    // }

    // if (avoidThings && avoidThings?.length) {
    //   updateObj.avoidThings = avoidThings;
    // }

    // let country = null;

    // if (type === PLACE.DOMESTIC) {
    //   country = await Place.findById(countryId).lean().exec();
    //   if (!country) throw new Error("Can't find Country !");
    //   updateObj.countryId = countryId;
    //   updateObj.countryName = country?.name;
    // }

    if (thingsTodoArr && thingsTodoArr?.length > 0) {
      for (const el of thingsTodoArr) {
        if (el?.updated) {
          el.image = await storeFileAndReturnNameBase64(el?.image);
        }
      }

      updateObj.thingsTodoArr = thingsTodoArr;
    }

    if (name !== place?.name) {
      const baseSlug = createSlug(name);
      const uniqueSlug = await generateUniqueSlug(baseSlug, Place);
      updateObj.slug = uniqueSlug;
    }

    if (cover) {
      cover = await storeFileAndReturnNameBase64(cover);
      updateObj.cover = cover;
    }

    if (aboutImage) {
      aboutImage = await storeFileAndReturnNameBase64(aboutImage);
      updateObj.aboutImage = aboutImage;
    }

    if (image) {
      image = await storeFileAndReturnNameBase64(image);
      updateObj.image = image;
    }

    console.log(updateObj, "UPDATE OBJ");

    await Place.findByIdAndUpdate(id, updateObj);

    res.status(200).json({ message: "place updated successfully", data: place });
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Place");

    const place = await Place.findById(id).lean().exec();

    if (!place) throw new Error("Can't find place");

    res.status(200).json({ message: "place By Id", data: place });
  } catch (error) {
    next(error);
  }
};

/* USER */

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (!slug) throw new Error("Can't find Place !");
    const place = await Place.findOne({ slug: slug }).lean().exec();
    if (!place) throw new Error("Can't find Place !");
    res.status(200).json({ message: "Single Place", data: place });
  } catch (error) {
    next(error);
  }
};

export const getPlacesForUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};
    let sortObj: Record<string, any> = {};
    let pipeline: PipelineStage[] = [];

    const { type, countryId, showInMenu, isTopDestination } = req.query;

    if (type && typeof type === "string") {
      matchObj.type = type;
    }

    if (typeof showInMenu === "string") {
      matchObj.showInMenu = Boolean(showInMenu);
    }

    if (isTopDestination && typeof isTopDestination === "string") {
      matchObj.isTopDestination = Boolean(isTopDestination);
      sortObj.isTopDestinationOrder = 1;
    } else {
      sortObj.createdAt = -1;
    }

    if (countryId && typeof countryId === "string") {
      matchObj.countryId = new Types.ObjectId(countryId);
    }

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: sortObj,
      },
    ];

    if (isTopDestination && typeof isTopDestination === "string") {
      pipeline.push(
        {
          $lookup: {
            from: "packages",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [{ $eq: ["$countryId", "$$id"] }, { $eq: ["$placeId", "$$id"] }],
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "packages",
          },
        },
        {
          $unwind: {
            path: "$packages",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            packages: "$packages.count",
          },
        },
      );
    }

    if (showInMenu && typeof showInMenu === "string") {
      pipeline.push({
        $project: {
          name: "$name",
          slug: "$slug",
          type: "$type",
          image: "$image",
          dropdownTitle: "$dropdownTitle",
        },
      });
    }

    const paginated = await paginateAggregate(Place, pipeline, req.query);
    res.status(200).json({ message: "All Places.", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};
