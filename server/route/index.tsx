import { Router } from "express"
import userRoute from "./users.route"
import authRoute from "./auth.route"
import tempRoute from "./temp.route"


const baseRouter: Router = Router()

baseRouter.use("/api/user", userRoute)
baseRouter.use("/api/auth", authRoute)
baseRouter.use("/api/temp", tempRoute)


export default baseRouter