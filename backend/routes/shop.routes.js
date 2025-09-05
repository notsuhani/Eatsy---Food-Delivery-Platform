import express from "express";
import { createAndEditShop } from "../controllers/shop.controllers";
import isAuth from "../middlewares/auth.middleware.js";
import { upload } from "../middlwares/multer.js";

const shopRouter = express.Router();

shopRouter.get('/create-edit',isAuth,upload.single("image"),createAndEditShop)

export default shopRouter;