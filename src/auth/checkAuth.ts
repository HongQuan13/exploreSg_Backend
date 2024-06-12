import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      console.log(error);
      next(error);
    });
  };
};

export const local_login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local-login",
      function (err: any, user: any, infor: any) {
        if (err) {
          return res.status(404).json({ error: err });
        }
        if (!user) {
          return res.status(400).json({ error: "User not exist", infor });
        }
        req.logIn(user, function (err) {
          if (err) return res.status(404).json({ error: err });
          const responseData = {
            id: user.id,
            username: user.username,
            email: user.email,
          };
          return res
            .status(200)
            .json({ status: "success", metadata: responseData });
        });
      }
    )(req, res, next);
  }
);

export const logOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.user;
    req.logout(function (err: any) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        status: "success",
        message: `log out from account ${accountId}`,
      });
    });
  }
);

export const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({
      authentication: "false",
      status: "fail",
      message: "Access denied, unauthorized",
    });
  }
);
