import mongoose from "mongoose";
import UserService from "./user.service";
import { BadRequestError } from "../core/error.response";
import conversationModel from "../models/conversation.model";

class ChatService {
  static async createConversation({ chatMembers }: { chatMembers: string[] }) {
    console.log(chatMembers);
    // Create a new conversation
    if (!chatMembers || chatMembers.length <= 1) {
      throw new BadRequestError("Bad request");
    }
    // Loop through the array to check if all memeber account existed
    for (let chatMember of chatMembers) {
      console.log("Starting: ", chatMember, "tesing loop");
      const foundUser = await UserService.getUserById(chatMember);
      if (!foundUser) throw new BadRequestError("User not existing");
    }
    // Create a new conversation
    const newConversation = await conversationModel.create({
      participants: chatMembers,
    });

    return newConversation;
  }
  static async allConversation(userId: string) {
    // Return all conversations of an account
    const foundUser = await UserService.getUserById(userId);
    if (!foundUser) throw new BadRequestError("User not existing");

    const allConversations = await conversationModel
      .find({
        participants: userId,
      })
      .sort({ updatedAt: "desc" });

    return allConversations;
  }
  static async getConversationContent() {
    // Return all a chat content of a conversation
  }
  static async sendMessage() {
    // Send message to a conversation
  }
}

export default ChatService;
