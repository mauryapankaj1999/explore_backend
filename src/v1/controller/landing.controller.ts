import { NextFunction, Request, Response } from "express";
import { ContactUs } from "models/contact.model";
import { Landing } from "models/landing.modal";
import { Package } from "models/package.model";
import { PipelineStage } from "mongoose";
import { verifyRequiredFields } from "utils/error";
import { paginateAggregate } from "utils/paginateAggregate";

export const createLanding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      name,
      // email,
      mobile,
      destination,
      travelDate,

      // message,
      // packageId,
    } = req.body;

    console.log(req.body, "LANDING");

    let requiredFields: any = {
      Name: name,
      // Email: email,
      Mobile: mobile,
      Destination: destination,
      travelDate: travelDate,

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

    await Landing.create({ ...req.body });

    res.status(200).json({ message: "Thank you for contact us sadfasd" });
  } catch (error) {
    next(error);
  }
};

export const createLandingUtm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      name,
      // email,
      mobile,
      destination,
      travelDate,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      gclid,
      // message,
      // packageId,
    } = req.body;

    console.log(req.body, "LANDING");

    let requiredFields: any = {
      Name: name,
      // Email: email,
      Mobile: mobile,
      Destination: destination,
      travelDate: travelDate,
      utm_source: utm_source,
      utm_medium: utm_medium,
      utm_campaign: utm_campaign,
      utm_term: utm_term,
      utm_content: utm_content,
      gclid: gclid,
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

    await Landing.create({ ...req.body });

    res.status(200).json({ message: "Thank you for contact us sadfasd" });
  } catch (error) {
    next(error);
  }
};

export const getLanding = async (req: Request, res: Response, next: NextFunction) => {
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

    const paginated = await paginateAggregate(Landing, pipeline, req.query);
    res
      .status(200)
      .json({ message: "Contact us message list for landing", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const deleteLanding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let id = req.params.id;
    const landing = await Landing.findByIdAndDelete(id).lean().exec();
    res.status(200).json({ message: "Enquiry  deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
