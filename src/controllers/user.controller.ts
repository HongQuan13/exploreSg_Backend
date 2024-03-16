"use strict";

import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../core/success.response";
import UserService from "../services/user.service";

export class userController {
  static updateUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull update username successfully",
      metadata: await UserService.updateUsername({
        ...req.body,
      }),
    }).send(res);
  };
}
