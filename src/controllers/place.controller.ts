"use strict";

import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../core/success.response";
import ImageService from "../services/image.service";
import PlaceService from "../services/place.service";

export class placeController {
  static newPlace = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Succesfull create upload new place",
      metadata: await PlaceService.newPlace({
        ...req.body,
        place_images: req?.files,
      }),
    }).send(res);
  };
  static searchPlace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull get all place data",
      metadata: await PlaceService.searchPlace(req?.query?.query),
    }).send(res);
  };
  static searchAutocomplete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull get search autocomplete",
      metadata: await PlaceService.searchTitle(req?.query?.query),
    }).send(res);
  };
  static getPlaceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull get place's details",
      metadata: await PlaceService.getPlaceById(req?.params?.id),
    }).send(res);
  };
  static updatePlace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull update place",
      metadata:
        (await PlaceService.updatePlace({
          ...req.body,
          id: req.params.id,
          place_images: req?.files,
        })) || {},
    }).send(res);
  };
  static deletePlace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull delete Place",
      metadata: (await PlaceService.deletePlace(req.params.id)) || {},
    }).send(res);
  };
  static getPlaceByAuthorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull get place's details",
      metadata: await PlaceService.getPlaceByAuthorId(req?.params?.id),
    }).send(res);
  };
  static applyFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Succesfull apply filter to place data",
      metadata: await PlaceService.applyFilter({
        searchKey: req?.query?.query,
        ...req.body,
      }),
    }).send(res);
  };
}
