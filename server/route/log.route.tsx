import { Router, Request, Response } from "express";
import { IQuerys } from "../interface/common.interface";
import logController from "../controller/log.controller";

const logRoute = Router();

logRoute
  .get("/", async (req: Request, res: Response) => {
    try {
      const result = await logController.log(req?.params as unknown as IQuerys);
      res.status(200).json({ result });
    } catch (err: any) {
      res.status(400).json({ message: err?.message });
    }
  })
  .post("/addlog", async (req: Request, res: Response) => {
    try {
        const result = await logController.addlog(req?.body);
        res.status(200).json({ result });
    } catch (err: any) {
        res.status(400).json({ message: err?.message });
    }
  });

export default logRoute;
