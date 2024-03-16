import { BadRequestError } from "../core/error.response";
import { placeModel } from "../models/place.model";
import reviewModel from "../models/review.model";
import { userModel } from "../models/user.model";
import { getSelectData } from "../utils";

class UserService {
  static getUserByEmail = async (email: string) => {
    const foundUser = await userModel.findOne({ email: email });
    console.log(foundUser);
    return foundUser;
  };
  static getUserById = async (id: string) => {
    const foundUser = await userModel
      .findById(id)
      .select(getSelectData(["email", "username"]));
    return foundUser;
  };

  static updateUsername = async ({
    id,
    newUsername,
  }: {
    id: string;
    newUsername: string;
  }) => {
    const query = {
        _id: id,
      },
      updateSet = {
        username: newUsername,
      },
      options = {
        upsert: true,
        new: true,
        projection: getSelectData(["_id", "username", "email"]),
      };
    const foundUser = await this.getUserById(id);
    if (!foundUser) throw new BadRequestError("User not exist");
    const updates = await userModel.findOneAndUpdate(query, updateSet, options);
    return updates;
  };

  static updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const foundUser = this.getUserById(id);
    if (!foundUser) throw new BadRequestError("User not exist");

    // Check old password match or not
    // Hash and change to new password
  };
}

export default UserService;
