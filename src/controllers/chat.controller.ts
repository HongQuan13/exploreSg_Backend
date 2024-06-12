"use strict";

import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../core/success.response";
import ChatService from "../services/chat.service";

export class chatController {
  static allConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull return all available conversations",
      metadata: await ChatService.allConversation(req?.params?.id),
    }).send(res);
  };
  static allFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull return all available friends",
      metadata: await ChatService.allFriend(req?.params?.id),
    }).send(res);
  };
  static newConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new CREATED({
      message: "Succesfull created a new conversation",
      metadata: await ChatService.createConversation({ ...req.body }),
    }).send(res);
  };
  static getConversationContent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull get message content",
      metadata: await ChatService.getConversationContent(req?.params?.id),
    }).send(res);
  };
  static sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull send a new message",
      metadata: await ChatService.sendMessage({ ...req.body }),
    }).send(res);
  };
}
