import { NextFunction, Request, Response } from "express";
import { TermsAndCondition } from "models/termsAndConditon";
import { paginateAggregate } from "utils/paginateAggregate";

export const createTermsAndConditions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { termsAndCondition } = req.body;
    console.log(req.body, "terms and condition");

    if (!termsAndCondition) throw new Error("Terms and conditons required");

    await TermsAndCondition.create(req.body);
    res.status(200).json({ message: "Terms And Condition Added Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getTermsAndCondition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paginated = await paginateAggregate(TermsAndCondition, [], req.query);

    res.status(200).json({ message: "All Terms And Condtion", data: paginated.data, total: paginated.total });
  } catch (error) {
    next(error);
  }
};

export const getTermsAndConditionForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const termsAndCondition = await TermsAndCondition.findOne({}).lean().exec();

    res.status(200).json({ message: "Terms And Condtion for user", data: termsAndCondition });
  } catch (error) {
    next(error);
  }
};

export const getTermsAndConditionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Can't find Terms And Condition");

    const terms = await TermsAndCondition.findById(id).lean().exec();

    if (!terms) throw new Error("Can't find Terms and condition");

    res.status(200).json({ message: "All Terms And Condtion", data: terms });
  } catch (error) {
    next(error);
  }
};

export const updateTermsAndCondition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Invalid Terms and condition Id");

    if (!req.body.termsAndCondition) throw new Error("Terms and condtion required.");

    await TermsAndCondition.findByIdAndUpdate(id, req.body);

    res.status(200).json({ message: "Terms And Condtion updated Successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteTermsAndCondition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Invalid Terms and condition Id");

    if (req.body.termsAndCondition) throw new Error("Terms and condtion required.");

    await TermsAndCondition.findByIdAndDelete(id);

    res.status(200).json({ message: "Terms And Condtion deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
