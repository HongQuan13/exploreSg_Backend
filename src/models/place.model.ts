import mongoose, { model } from "mongoose";

const DOCUMENT_NAME: string = "Place";
const COLLECTION_NAME: string = "Places";

const ImageSchema = new mongoose.Schema(
  {
    img_url: { type: String, required: true },
    img_filename: String,
    thumb_url: { type: String, required: true },
    public_id: String,
  },
  {
    timestamps: true,
    collection: "Images",
  }
);
const placeSchema = new mongoose.Schema(
  {
    place_title: {
      type: String,
      required: true,
    },
    place_images: [ImageSchema],
    place_geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    place_price: {
      type: Number,
    },
    place_description: String,
    place_location: { type: String, required: true },
    place_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    place_reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
placeSchema.index({
  place_title: "text",
  place_description: "text",
});
placeSchema.index({
  place_geometry: "2dsphere",
});

//Export the model
const imageModel = model("Image", ImageSchema);
const placeModel = model(DOCUMENT_NAME, placeSchema);

export { placeModel, imageModel };
