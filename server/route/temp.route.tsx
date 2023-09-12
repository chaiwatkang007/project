import { Router, Request, Response } from "express"
import { IQuerys } from "../interface/common.interface"
import tempController from "../controller/temp.controller"


const tempRoute = Router()

tempRoute
    .get("/", async(req: Request, res: Response) => {
        try {
            const result = await tempController.temp(req?.params as unknown as IQuerys)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/create", async(req: Request, res: Response) => {
        try {
            const result = await tempController.create(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/update", async(req: Request, res: Response) => {
        try {
            const result = await tempController.update(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    .post("/daytemp", async(req: Request, res: Response) => {
        try {
            const result = await tempController.daytemp(req?.body)
            res.status(200).json({ result })
        } catch(err: any) {
            res.status(400).json({ message: err?.message })
        }
    })
    

    

export default tempRoute