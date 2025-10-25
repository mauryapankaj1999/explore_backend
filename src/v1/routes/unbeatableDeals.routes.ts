import express from "express";
import {
  createUnbeatableDeals,
  deleteUnbeatableDeals,
  getUnbeatableDealById,
  getUnbeatableDeals,
  getUnbeatableDealsForUser,
  updateUnbeatableDealById,
  updateViewOrder,
} from "v1/controller/unbeatableDeals.controller";

const router = express.Router();
/* ADMIN */
router.post("/", createUnbeatableDeals);
router.get("/", getUnbeatableDeals);
router.get("/get_by_id/:id", getUnbeatableDealById);
router.patch("/deal/:id", updateUnbeatableDealById);
router.patch("/order", updateViewOrder);
router.delete("/", deleteUnbeatableDeals);

/* USER */
router.get("/for_user", getUnbeatableDealsForUser);
export default router;
