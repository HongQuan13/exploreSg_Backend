import mongoose, { Schema, Document } from "mongoose";
import { userModel } from "./user.model";

const DOCUMENT_NAME: string = "Conversation";
const COLLECTION_NAME: string = "Conversations";

interface IConversation extends Document {
  name: string;
  participants: any;
  messages: Array<mongoose.Types.ObjectId>;
}

const conversationSchema: Schema<IConversation> = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

conversationSchema.pre("save", async function (next) {
  if (!this.name || this.name === "") {
    try {
      const listUsers = await userModel.find({
        _id: { $in: this.participants },
      });
      const usernames = listUsers.map((user: any) => user.username);
      this.name = usernames.join(", ");
    } catch (err: any) {
      return next(err);
    }
  }
  next();
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, conversationSchema);
