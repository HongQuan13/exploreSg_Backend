import mongoose, { model } from "mongoose";

const DOCUMENT_NAME: string = "Message";
const COLLECTION_NAME: string = "Messages";

// Declare the Schema of the Mongo model
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, messageSchema);
