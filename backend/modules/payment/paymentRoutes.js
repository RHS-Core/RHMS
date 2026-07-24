import { Router } from "express";
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
export default router;