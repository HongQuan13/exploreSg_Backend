import { Router } from "express";
import {
  asyncHandler,
  local_login,
  authentication,
  logOut,
} from "../../auth/checkAuth";
import { accessController } from "../../controllers/access.controller";

const router = Router();

// router.use(authentication);
router.post("/register", asyncHandler(accessController.register));
router.post("/login", local_login, asyncHandler(accessController.login));
router.post(
  "/logout",
  authentication,
  logOut,
  asyncHandler(accessController.logout)
);
router.post("/isLogin", asyncHandler(accessController.isLogin));
router.post("/currentUser", asyncHandler(accessController.currentUser));

export default router;
