import express from "express";
import { getme } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
router.get("/getme", protectRoute, getme);

export default router;
