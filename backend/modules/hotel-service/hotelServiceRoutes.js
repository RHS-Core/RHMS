import { Router } from "express";
import { getAll, create, getById, update, remove } from "./hotelServiceController.js";

const router = Router();

router.get("/hotel-service", getAll);
router.post("/hotel-service", create);
router.get("/hotel-service/:id", getById);
router.put("/hotel-service/:id", update);
router.delete("/hotel-service/:id", remove);

export default router;