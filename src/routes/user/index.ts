import { Router } from "express";
import { asyncHandler, authentication } from "../../auth/checkAuth";
import { userController } from "../../controllers/user.controller";

const router = Router();

router.use(authentication);
router.post("/updateUsername", asyncHandler(userController.updateUsername));

export default router;
