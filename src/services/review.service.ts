import { AuthFailureError } from "../core/error.response";
import { placeModel } from "../models/place.model";
import reviewModel from "../models/review.model";
import { userModel } from "../models/user.model";
import { getSelectData } from "../utils";
import UserService from "./user.service";

class ReviewService {
  static createReview = async ({
    place_id,
    review_comment,
    review_rating,
    review_author,
  }: {
    place_id: string;
    review_comment: string;
    review_rating: number;
    review_author: string;
  }) => {
    const foundUser = await UserService.getUserById(review_author);
    if (!foundUser) throw new AuthFailureError("Author account not exist!");
    const newComment = await reviewModel.create(
      {
        review_place: place_id,
        review_author: review_author,
        review_rating: review_rating,
        review_comment: review_comment,
      },
      {
        projection: getSelectData(["_id", "review_author"]),
      }
    );
    if (!newComment) throw new Error("Create a new Error failed");

    const query = {
        _id: place_id,
      },
      updateSet = {
        $push: {
          place_reviews: newComment,
        },
      },
      options = {
        new: true,
        create: false,
      };
    await placeModel.updateOne(query, updateSet, options);
    return newComment;
  };

  static getReviewById = async ({ place_id }: { place_id: string }) => {
    const allReview = await reviewModel
      .find({ review_place: place_id })
      .select(
        getSelectData(["review_comment", "review_rating", "review_author"])
      )
      .sort({ createdAt: 1 });
    if (!allReview) throw new Error("Cannot get review of place");
    return allReview;
  };
  static deleteReview = async (place_id: string) => {
    const deleteReview = await reviewModel.deleteMany(
      {
        review_place: place_id,
      },
      {
        projection: getSelectData(["_id", "review_author"]),
      }
    );
    return deleteReview;
  };
}

export default ReviewService;
