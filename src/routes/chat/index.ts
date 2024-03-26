import { Router } from "express";
import {
  asyncHandler,
  local_login,
  authentication,
} from "../../auth/checkAuth";
import { chatController } from "../../controllers/chat.controller";

const router = Router();
// router.use(authentication);
router.post(
  "/allConversation/:id",
  asyncHandler(chatController.allConversation)
);
router.post("/newConversation", asyncHandler(chatController.newConversation));

export default router;
