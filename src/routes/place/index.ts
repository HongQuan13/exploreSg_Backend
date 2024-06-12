import { Router } from "express";
import {
  asyncHandler,
  local_login,
  authentication,
} from "../../auth/checkAuth";
import uploadDisk from "../../configs/multer.config";
import { placeController } from "../../controllers/place.controller";

const router = Router();
router.use(authentication);
router.post(
  "/new",
  uploadDisk.array("place_images"),
  asyncHandler(placeController.newPlace)
);

router.post("/search", asyncHandler(placeController.searchPlace));
router.post("/filter", asyncHandler(placeController.applyFilter));
router.post(
  "/search/autocomplete",
  asyncHandler(placeController.searchAutocomplete)
);
router.post("/detail/:id", asyncHandler(placeController.getPlaceById));
router.patch(
  "/update/:id",
  uploadDisk.array("place_images"),
  asyncHandler(placeController.updatePlace)
);
router.post("/delete/:id", asyncHandler(placeController.deletePlace));
router.post(
  "/ownedPlace/:id",
  asyncHandler(placeController.getPlaceByAuthorId)
);
export default router;
