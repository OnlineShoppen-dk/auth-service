import { Application } from "express";
import { router } from "../routes";
import { amqp_setup } from "../config/amqp";
import middlewares from "../middleware";

const init = (app: Application) => {
  middlewares(app);
  amqp_setup();
  router(app);
};

export default init;
