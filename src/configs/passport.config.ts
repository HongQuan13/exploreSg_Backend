import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UserService from "../services/user.service";
import { userModel } from "../models/user.model";

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function verify(email: string, password: string, done: any) {
      try {
        email = email.toLowerCase();
        const foundUser = await UserService.getUserByEmail(email);
        if (!foundUser) {
          return done(null, false, { message: "This account not exist" });
        } else {
          const compare = await bcrypt.compare(password, foundUser?.password);
          if (compare) {
            return done(null, foundUser);
          } else {
            return done(null, false, { message: "Email or password wrong" });
          }
        }
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});
passport.deserializeUser((id: string, done: any) => {
  userModel.findById(id, (error: any, user: any) => {
    done(null, id);
  });
});

export default passport;
