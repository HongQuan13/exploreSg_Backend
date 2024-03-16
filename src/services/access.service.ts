import { BadRequestError } from "../core/error.response";
import bcrypt from "bcrypt";
import { getInfoData } from "../utils";
import { userModel } from "../models/user.model";

class AccessService {
  static register = async ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => {
    email = await email.toLowerCase();
    const foundUser = await userModel.findOne({ email: email });
    if (foundUser) throw new BadRequestError("Account already exists");

    const salt = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);
    const newAccount = await userModel.create({
      username: username,
      email: email,
      password: passwordHash,
    });
    return getInfoData({
      fields: ["_id", "username", "email"],
      object: newAccount,
    });
  };
}

export default AccessService;
