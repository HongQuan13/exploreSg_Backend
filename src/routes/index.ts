import { Router } from "express";
import place from "./place";
import review from "./review";
import access from "./access";
import user from "./user";
import { local_login, authentication } from "../auth/checkAuth";
const routes = Router();

routes.use("/v1/api/access", access);
routes.use("/v1/api/place", place);
routes.use("/v1/api/review", review);
routes.use("/v1/api/user", user);

export default routes;
