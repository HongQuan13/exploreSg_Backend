"use strict";

import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../core/success.response";
import AccessService from "../services/access.service";
import UserService from "../services/user.service";

export class accessController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Succesfull created a new account",
      metadata: await AccessService.register({ ...req.body }),
    }).send(res);
  };
  static login = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Succesfull login",
      metadata: {},
    }).send(res);
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Succesfull logout",
      metadata: {},
    }).send(res);
  };

  static isLogin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated())
      return res.status(200).json({
        authenticated: true,
      });
    return res.status(200).json({
      authenticated: false,
    });
  };

  static currentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.isAuthenticated()) {
      const currentUser = await UserService.getUserById(req.user.toString());
      res.status(200).json({
        authenticated: true,
        userData: {
          id: req.user,
          username: currentUser?.username,
          email: currentUser?.email,
        },
      });
    } else {
      res.status(200).json({
        authenticated: false,
      });
    }
  };
}
