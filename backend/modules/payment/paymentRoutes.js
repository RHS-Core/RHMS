import { Router } from "express";
import { successResponse } from '../../utils/apiResponse.js';
const router = Router();
router.get("/payment/health", (req, res) => {
    return successResponse(res, 200, "Payment module is healthy", {
        module: "payment",
        status: "ok",
    });
});
export default router;