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
  static newConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.body, "testing body");
    new CREATED({
      message: "Succesfull created a new conversation",
      metadata: await ChatService.createConversation({ ...req.body }),
    }).send(res);
  };
}
