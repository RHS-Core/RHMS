import { Router } from "express";
import { create, methods, getAll  } from "./paymentController.js";

const router = Router();
router.get("/payment/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Payment module is healthy",
        data: {
            module: "payment",
            status: "ok",
        },
    });
});

router.get("/payment/methods", methods);
router.post("/payment", create);
router.get("/payment", getAll);

export default router;