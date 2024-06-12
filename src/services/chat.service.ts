import mongoose from "mongoose";
import UserService from "./user.service";
import { BadRequestError } from "../core/error.response";
import conversationModel from "../models/conversation.model";
import { userModel } from "../models/user.model";
import { getSelectData, unGetSelectData } from "../utils";
import messageModel from "../models/message.model";
import { getReceiverSocketId, io } from "../socket/socket";

class ChatService {
  static async createConversation({ chatMembers }: { chatMembers: string[] }) {
    console.log(chatMembers);
    if (!chatMembers || chatMembers.length <= 1) {
      throw new BadRequestError("Bad request");
    }
    // Loop through the array to check if all memeber account existed
    for (let chatMember of chatMembers) {
      console.log("Starting: ", chatMember, "tesing loop");
      const foundUser = await UserService.getUserById(chatMember);
      if (!foundUser) throw new BadRequestError("User not existing");
    }
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
  static async allFriend(userId: string) {
    // Return all other friend accounts
    const foundUser = await UserService.getUserById(userId);
    if (!foundUser) throw new BadRequestError("User not existing");

    const allFriends = await userModel.find({
      _id: { $ne: userId },
    });

    return allFriends;
  }
  static async getConversationContent(conversationId: string) {
    // Return all a chat content of a conversation
    const allMessage = await conversationModel
      .findById(conversationId)
      .select(getSelectData(["messages"]))
      .sort({ createdAt: "desc" });
    if (!allMessage) throw new BadRequestError("Conversation not exist");
    var listMessage: string[][] = [];
    for (const e of allMessage.messages) {
      let content = await messageModel.findById(e);
      listMessage.push(content);
    }
    return listMessage;
  }
  static async sendMessage({
    senderId,
    conversationId,
    messageContent,
  }: {
    senderId: string;
    conversationId: string;
    messageContent: string;
  }) {
    const conversation = await conversationModel.findById(conversationId);
    if (!conversation) throw new BadRequestError("Conversation not exist");

    const newMessage = await messageModel.create({
      senderId: senderId,
      conversationId: conversationId,
      message: messageContent,
    });

    await conversationModel.findByIdAndUpdate(conversationId, {
      $push: { messages: newMessage._id },
    });

    for (let i of conversation.participants) {
      if (i == senderId) continue;
      const receiverSocketId = getReceiverSocketId(i);
      io.to(receiverSocketId).emit("newMessage", {
        conversationId,
        newMessage,
      });
      console.log(receiverSocketId, "receiverId", newMessage);
    }
    return newMessage;
  }
}

export default ChatService;
