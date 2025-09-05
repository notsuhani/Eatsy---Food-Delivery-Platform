import express from "express";
import isAuth from "../middlewares/auth.middleware.js";
import { addItem } from "../controllers/item.controllers.js";
import { upload } from "../middlwares/multer.js";

const itemRouter = express.Router();

itemRouter.post('/add-item',isAuth,upload.single("image"),addItem)
itemRouter.post("edit-item/:itemId",isAuth,upload.single("image"),editItem)

export default itemRouter;