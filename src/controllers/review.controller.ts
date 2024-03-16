"use strict";

import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../core/success.response";
import ReviewService from "../services/review.service";

export class reviewController {
  static newReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new CREATED({
      message: "Succesfull create upload new review",
      metadata: await ReviewService.createReview({
        ...req.body,
      }),
    }).send(res);
  };
  static allReviewOfPlace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull return all review of place",
      metadata: await ReviewService.getReviewById({
        ...req.body,
      }),
    }).send(res);
  };
}
