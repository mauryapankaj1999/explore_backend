import { NextFunction, Request, Response } from "express";
import { ContactUs } from "models/contact.model";
import { Package } from "models/package.model";
import { PipelineStage } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { paginateAggregate } from "utils/paginateAggregate";

export const createContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      name,
      // email,
      mobile,
      destination,
      // message,
      // packageId,
    } = req.body;

    let requiredFields: any = {
      Name: name,
      // Email: email,
      Mobile: mobile,
      Destination: destination,
      // Message: message,
    };

    verifyRequiredFields(requiredFields);

    // let pacakgeName = "";

    // if (packageId && typeof packageId === "string") {
    //   let packag = await Package.findById(packageId).lean().exec();
    //   if (packag) {
    //     pacakgeName = packag?.name;
    //   }
    // }

    await ContactUs.create({ ...req.body });

    res.status(200).json({ message: "Thank you for your valuable feed back" });
  } catch (error) {
    next(error);
  }
};

export const getContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let matchObj: Record<string, any> = {};

    if (req.query.isDeleted) {
      matchObj.isDeleted = req.query.isDeleted === "true";
    } else {
      matchObj.isDeleted = { $ne: true };
    }
    let pipeline: PipelineStage[] = [];

    pipeline = [
      {
        $match: matchObj,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const paginated = await paginateAggregate(ContactUs, pipeline, req.query);
    res.status(200).json({ message: "Contact us message list", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const deleteContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const id = req.params.id;
    const contactUs = await ContactUs.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).lean().exec();

    if (!contactUs) {
      return res.status(404).json({ message: "Enquiry Form not found" });
    }

    res.status(200).json({ message: "Enquiry Form deleted successfully" });
  } catch (error) {
    next(error);
  }
};

