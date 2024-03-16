import mongoose, { model } from "mongoose";

const DOCUMENT_NAME: string = "Review";
const COLLECTION_NAME: string = "Reviews";

// Declare the Schema of the Mongo model
const reviewSchema = new mongoose.Schema(
  {
    review_place: {
      type: mongoose.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    review_comment: String,
    review_rating: {
      type: Number,
      defautl: 4.0,
      min: [1, "The minimum value should above 1"],
      max: [5, "The maximum value should below 5"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    review_author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, reviewSchema);
