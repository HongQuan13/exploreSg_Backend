import mongoose, { isValidObjectId } from "mongoose";
import { findGeocode } from "../configs/mapbox.config";
import { BadRequestError } from "../core/error.response";
import { placeModel, imageModel } from "../models/place.model";
import { userModel } from "../models/user.model";
import { getInfoData, getSelectData } from "../utils";
import ImageService from "./image.service";
import ReviewService from "./review.service";
import UserService from "./user.service";

class PlaceService {
  static async newPlace({
    place_title,
    place_images,
    place_price,
    place_description,
    place_location,
    place_authorId,
  }: {
    place_title: string;
    place_images: any;
    place_price: number;
    place_description: string;
    place_location: string;
    place_authorId: mongoose.Types.ObjectId;
  }) {
    console.log(
      place_title,
      place_images,
      place_price,
      place_description,
      place_location,
      place_authorId
    );

    if (!place_images.length) throw new Error("missing image file");
    const uploadedImages = await ImageService.createMultipleImages({
      images: place_images,
    });
    console.log(uploadedImages);
    if (!uploadedImages?.length) throw new Error("create email failed");
    const place_geometry = await findGeocode(place_location);
    const newPlace = await placeModel.create({
      place_title: place_title,
      place_images: uploadedImages,
      place_price: place_price,
      place_description: place_description,
      place_location: place_location,
      place_author: place_authorId,
      place_geometry: place_geometry,
    });
    if (!newPlace) throw new Error("Unable save the new place");
    console.log("create new place model successfull");
    return getInfoData({
      fields: ["_id", "place_title"],
      object: newPlace,
    });
  }
  static async searchPlace(search: any) {
    let placeResponse;
    console.log(search);
    if (search) {
      // If search exists, the user typed in the search bar
      placeResponse = await placeModel
        .aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: search,
                path: ["place_title", "place_description"],
                fuzzy: {},
              },
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              _id: 1,
              place_title: 1,
              place_description: 1,
              place_location: 1,
              place_images: 1,
              place_geometry: 1,
              place_price: 1,
              score: {
                $meta: "searchScore",
              },
            },
          },
        ])
        .allowDiskUse(true);
    } else {
      // The search is empty so the value of "search" is undefined
      // placeResponse = await placeModel.find({}).sort({ createdAt: "desc" });
      placeResponse = await placeModel
        .find({})
        .select(
          getSelectData([
            "_id",
            "place_title",
            "place_description",
            "place_images",
            "place_geometry",
            "place_price",
          ])
        )
        .sort({ createdAt: "desc" });
    }

    return placeResponse ? placeResponse : {};
  }

  static async searchTitle(search: any) {
    let placeResponse;
    if (search) {
      // If search exists, the user typed in the search bar
      placeResponse = await placeModel
        .aggregate([
          {
            $search: {
              index: "autocompletion",
              autocomplete: {
                query: search,
                path: "place_title",
              },
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              _id: 1,
              place_title: 1,
              place_location: 1,
            },
          },
        ])
        .allowDiskUse(true);
    }
    return placeResponse ? placeResponse : {};
  }
  static async getPlaceById(id: string) {
    const detailPlace = await placeModel.findById(id);
    if (!detailPlace) throw new BadRequestError("Place not exists!");
    const userData = await UserService.getUserById(detailPlace.place_author);
    if (!userData) throw new BadRequestError("Author data missing");
    detailPlace.place_author = userData;
    return getInfoData({
      fields: [
        "place_title",
        "place_images",
        "place_geometry",
        "place_price",
        "place_description",
        "place_location",
        "place_reviews",
        "place_author",
      ],
      object: detailPlace,
    });
  }
  static async updatePlace({
    id,
    place_title,
    place_images,
    place_price,
    place_description,
    place_location,
    delete_images,
  }: {
    id: string;
    place_title: string;
    place_images: any;
    place_price: number;
    place_description: string;
    place_location: string;
    delete_images: any;
  }) {
    console.log(
      id,
      place_title,
      place_images,
      place_price,
      place_description,
      place_location,
      delete_images
    );
    let newImages = [];
    if (delete_images || place_images) {
      newImages = await ImageService.updateImages({
        place_id: id,
        delete_images: delete_images,
        new_images: place_images,
      });
    }
    const place_geometry = await findGeocode(place_location);
    const query = {
        _id: id,
      },
      updateSet = {
        place_title: place_title,
        place_price: place_price,
        place_description: place_description,
        place_location: place_location,
        place_geometry: place_geometry,
        $push: {
          place_images: { $each: newImages },
        },
      },
      options = {
        upsert: true,
        new: true,
        projection: getSelectData(["_id", "place_title"]),
      };
    const existingPlace = await placeModel.findOne(query).lean();
    if (existingPlace) {
      return await placeModel.findOneAndUpdate(query, updateSet, options);
    } else {
      return;
    }
  }
  static async deletePlace(id: string) {
    const deletePlace = await placeModel.findById(id);
    if (!deletePlace) throw new Error("Place not exist");
    // Delete image
    await ImageService.deleteImages(deletePlace.place_images);
    // Delete review
    await ReviewService.deleteReview(id);
    // Delete place
    const deletedPlace = await placeModel.findOneAndDelete(
      { _id: id },
      { projection: getSelectData(["_id", "place_title"]) }
    );
    return deletedPlace;
  }

  static async getPlaceByAuthorId(id: string) {
    const foundPlace = await placeModel
      .find({ place_author: id })
      .select(
        getSelectData([
          "_id",
          "place_title",
          "place_description",
          "place_images",
          // "place_geometry",
        ])
      )
      .sort({ createdAt: "desc" })
      .lean();
    return foundPlace;
  }

  static async applyFilter({
    searchKey,
    author,
    location,
    minPrice,
    maxPrice,
    // maxDistance = 1000,
    sortedBy,
  }: {
    searchKey: string;
    author?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    // maxDistance?: number;
    sortedBy?: string;
  }) {
    console.log(searchKey, author, location, minPrice, maxPrice, "filter");
    let geometryLocation: any;
    let placeResponse: any;
    let placeData: any;
    let geoNearResults: any;
    let authorId;
    if (author) {
      const authorInfor = await userModel
        .findOne({ username: author })
        .select(getSelectData(["_id"]))
        .lean();
      authorId = authorInfor._id;
      if (!authorId) return {};
    }
    let sortCriteria: any = {};

    if (sortedBy) {
      let sortField = sortedBy.split("-");
      console.log(sortField, "sortField");
      let sortDirect = sortField[1] === "asc" ? 1 : -1;
      sortCriteria[sortField[0]] = sortDirect;
      console.log(sortCriteria, 111);
    } else {
      sortCriteria.createdAt = 1;
    }
    if (location) {
      geometryLocation = await findGeocode(location);
      console.log(
        geometryLocation,
        "location filter",
        geometryLocation.coordinates
      );
      geoNearResults = await placeModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [
                geometryLocation.coordinates[0],
                geometryLocation.coordinates[1],
              ],
            },
            distanceField: "distance",
            maxDistance: 50000,
            // key: "place_geometry",
            // includeLocs: "dist.location",
            spherical: true,
          },
        },
      ]);
      console.log(geoNearResults, "geoNearResults");
    }

    if (searchKey) {
      placeData = await placeModel
        .aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: searchKey,
                path: ["place_title", "place_description"],
                fuzzy: {},
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $cond: {
                      if: { $ne: [authorId, undefined] },
                      then: {
                        $eq: [
                          "$place_author",
                          mongoose.Types.ObjectId(authorId),
                        ],
                      },
                      else: true,
                    },
                  },
                  {
                    $cond: {
                      if: { $ne: [minPrice, undefined] },
                      then: {
                        $gte: ["$place_price", minPrice],
                      },
                      else: true,
                    },
                  },
                  {
                    $cond: {
                      if: { $ne: [maxPrice, undefined] },
                      then: {
                        $lte: ["$place_price", maxPrice],
                      },
                      else: true,
                    },
                  },
                ],
              },
            },
          },
          // {
          //   $limit: 5,
          // },
          {
            $project: {
              _id: 1,
              place_title: 1,
              place_description: 1,
              place_location: 1,
              place_images: 1,
              place_geometry: 1,
              place_price: 1,
              createdAt: 1,
              score: {
                $meta: "searchScore",
              },
            },
          },
          {
            $sort: sortCriteria,
          },
        ])
        .allowDiskUse(true);
      console.log(placeResponse, "placeResponse");
    } else {
      placeData = await placeModel
        .aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $cond: {
                      if: { $ne: [authorId, undefined] },
                      then: {
                        $eq: [
                          "$place_author",
                          mongoose.Types.ObjectId(authorId),
                        ],
                      },
                      else: true,
                    },
                  },
                  {
                    $cond: {
                      if: { $ne: [minPrice, undefined] },
                      then: { $gte: ["$place_price", minPrice] },
                      else: true,
                    },
                  },
                  {
                    $cond: {
                      if: { $ne: [maxPrice, undefined] },
                      then: { $lte: ["$place_price", maxPrice] },
                      else: true,
                    },
                  },
                ],
              },
            },
          },
          {
            $project: getSelectData([
              "_id",
              "place_title",
              "place_description",
              "place_images",
              "place_geometry",
              "place_price",
              "createdAt",
            ]),
          },
          {
            $sort: sortCriteria,
          },
        ])
        .allowDiskUse(true);
      console.log(placeResponse, "placeResponse");
    }
    if (geoNearResults) {
      const geoNearIds = await placeData.map((result: any) =>
        String(result._id)
      );
      console.log(geoNearIds, "geoNearIds");
      placeResponse = geoNearResults.filter((result: any) =>
        geoNearIds.includes(String(result._id))
      );
    } else {
      placeResponse = placeData;
    }
    return placeResponse ? placeResponse : {};
  }
}

export default PlaceService;
