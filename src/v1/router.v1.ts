import express from "express";

import termsAndConditionRouter from "./routes/termsAndCondition.routes";
import blogRouter from "./routes/blog.routes";
import testimonialHomeRouter from "./routes/testimonialHome.routes";
import aminityRouter from "./routes/aminity.routes";
import contactUsRouter from "./routes/contactUs.routes";
import groupTourRouter from "./routes/groupTour.routes";
import faqRouter from "./routes/faq.routes";
import testimonialRouter from "./routes/testimonial.routes";
import partnerRouter from "./routes/partners.routes";
import bannerRouter from "./routes/banner.routes";
import mostViewedDestinationRouter from "./routes/mostViewedDestination.routes";
import unbeatableDealsRouter from "./routes/unbeatableDeals.routes";
import packageRouter from "./routes/package.routes";
import placeRouter from "./routes/place.routes";
import destinationRouter from "./routes/destination.routes";
import userRouter from "./routes/user.routes";
import landingRouter from "./routes/landing.routes";

const router = express.Router();

router.use("/termsandcondition", termsAndConditionRouter);
router.use("/blog", blogRouter);
router.use("/testimonial_home", testimonialHomeRouter);
router.use("/aminity", aminityRouter);
router.use("/contact_us", contactUsRouter);
router.use("/group_tour", groupTourRouter);
router.use("/faq", faqRouter);
router.use("/testimonial", testimonialRouter);
router.use("/partner", partnerRouter);
router.use("/banner", bannerRouter);
router.use("/unbeatable_deals", unbeatableDealsRouter);
router.use("/most_viewed_destination", mostViewedDestinationRouter);
router.use("/package", packageRouter);
router.use("/place", placeRouter);
router.use("/destination", destinationRouter);
router.use("/user", userRouter);
router.use("/landing", landingRouter);

export default router;
