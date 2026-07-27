import { Router } from "express";
import { getAll, create, getById, update } from "./hotelServiceController.js";

const router = Router();

router.get("/hotel-service", getAll);
router.post("/hotel-service", create);
router.get("/hotel-service/:id", getById);
router.put("/hotel-service/:id", update);

export default router;