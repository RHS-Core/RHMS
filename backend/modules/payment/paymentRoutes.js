import { Router } from "express";
import { create } from "./paymentController.js";
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
router.post("/payment", create);
export default router;