import mongoose from "mongoose";
import UserService from "./user.service";
import { BadRequestError } from "../core/error.response";
import conversationModel from "../models/conversation.model";

class ChatService {
  static async allConversation(userId: string) {
    // Return all conversations of an account
    const foundUser = await UserService.getUserById(userId);
    if (!foundUser) throw new BadRequestError("User not existing");

    const allConversations = await conversationModel.find;
  }
  static async getConversationContent() {
    // Return all a chat content of a conversation
  }
  static async sendMessage() {
    // Send message to a conversation
  }
}

export default ChatService;
