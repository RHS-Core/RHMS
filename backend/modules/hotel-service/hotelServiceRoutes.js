import { Router } from "express";
import { getAll, create } from "./hotelServiceController.js";

const router = Router();

router.get("/hotel-service", getAll);
router.post("/hotel-service", create);

export default router;