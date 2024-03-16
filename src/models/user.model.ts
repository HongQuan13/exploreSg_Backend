import mongoose, { model } from "mongoose";

const DOCUMENT_NAME: string = "User";
const COLLECTION_NAME: string = "Users";

// Declare the Schema of the Mongo model
const thirdPartyProviderSchema = new mongoose.Schema({
  provider_name: {
    type: String,
    default: null,
  },
  provider_id: {
    type: String,
    default: null,
  },
  provider_data: {
    type: {},
    default: null,
  },
});
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      default: ["user"],
    },
    third_party_auth: [thirdPartyProviderSchema],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const userModel = model("User", userSchema);
const thirdPartyAuthModel = model("ThirdPartyAuth", thirdPartyProviderSchema);

export { userModel };
