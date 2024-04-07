import { Application } from "express";
import { router } from "../routes";
import { amqp_setup } from "../config/amqp";

const init = (app: Application) => {
  router(app);
  amqp_setup();
};

export default init;
