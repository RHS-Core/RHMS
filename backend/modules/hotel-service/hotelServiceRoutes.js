import { Router } from "express";
import { getAll } from "./hotelServiceController.js";

const router = Router();

router.get("/hotel-service", getAll);

export default router;