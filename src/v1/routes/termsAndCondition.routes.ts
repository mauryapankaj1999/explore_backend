import express from "express";
import {
  createTermsAndConditions,
  deleteTermsAndCondition,
  getTermsAndCondition,
  getTermsAndConditionById,
  getTermsAndConditionForUser,
  updateTermsAndCondition,
} from "v1/controller/termsandconditions.controller";

const router = express.Router();

router.post("/", createTermsAndConditions);
router.get("/", getTermsAndCondition);
router.get("/for_user", getTermsAndConditionForUser);
router.get("/get_by_id/:id", getTermsAndConditionById);
router.patch("/:id", updateTermsAndCondition);
router.delete("/:id", deleteTermsAndCondition);

export default router;
