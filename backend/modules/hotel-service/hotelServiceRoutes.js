import { Router } from "express";
import { getAll, create, getById } from "./hotelServiceController.js";

const router = Router();

router.get("/hotel-service", getAll);
router.post("/hotel-service", create);
router.get("/hotel-service/:id", getById);

export default router;