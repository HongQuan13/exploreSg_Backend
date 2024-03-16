import { Router } from "express";
import { asyncHandler, authentication } from "../../auth/checkAuth";
import { reviewController } from "../../controllers/review.controller";

const router = Router();
router.use(authentication);
router.post("/new", asyncHandler(reviewController.newReview));
router.post("/all", asyncHandler(reviewController.allReviewOfPlace));
export default router;
