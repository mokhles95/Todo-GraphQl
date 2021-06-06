import bcrypt from "bcrypt";
import CreateError from "http-errors";
import { Request } from "express";

import { User } from "../../../graphql/schemas";
import { signAccessToken, authMiddleWare } from "../../../middleware/jwt.redis";

export interface InputFields {
  userName?: string;
  email: string;
  password: string;
}

export default class UserService {
  //  get list of users
  static async getUsers(req: Request) {
    try {
      const data = await authMiddleWare(req);
      if (!data?.id) return new CreateError.Unauthorized();

      return await User.find();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  create a user
  // this function recieve the username the email and the password
  static async createUser({ userName, email, password }: InputFields) {
    try {
      //  check if the email is already exist
      const userExist = await User.findOne({ email });
      if (userExist) return new CreateError.Conflict("email already exist");
      //  use of the bcrypt for more secrurity
      const salt = await bcrypt.genSalt(10);
      const hashPasword = await bcrypt.hash(password, salt);
      //   create the user
      const user = new User({
        userName: userName,
        email: email,
        password: hashPasword,
      });

      return await user.save();
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
  //  this is the login function
  static async login({ email, password }: InputFields) {
    try {
      //find the user by email
      const user = await User.findOne({ email });
      if (!user)
        return new CreateError.Unauthorized("incorrect email/password");
      //  comapre the password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass)
        return new CreateError.Unauthorized("incorrect email/password");
      //  generate the token
      const token = await signAccessToken(user._id);

      return { message: "logged successfully", token };
    } catch (error) {
      new CreateError.BadRequest(error.message);
    }
  }
}
