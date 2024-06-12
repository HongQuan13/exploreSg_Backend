import { Router } from "express";
import {
  asyncHandler,
  local_login,
  authentication,
} from "../../auth/checkAuth";
import { chatController } from "../../controllers/chat.controller";

const router = Router();
router.use(authentication);
router.post(
  "/allConversation/:id",
  asyncHandler(chatController.allConversation)
);
router.post("/allFriend/:id", asyncHandler(chatController.allFriend));
router.post("/newConversation", asyncHandler(chatController.newConversation));
router.post(
  "/getConversationContent/:id",
  asyncHandler(chatController.getConversationContent)
);
router.post("/sendMessage", asyncHandler(chatController.sendMessage));
export default router;
