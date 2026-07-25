import { Router } from "express";
import { successResponse } from '../../utils/apiResponse.js';
import { create, methods } from "./paymentController.js";

const router = Router();
router.get("/payment/health", (req, res) => {
    return successResponse(res, 200, "Payment module is healthy", {
        module: "payment",
        status: "ok",
    });
});

router.get("/payment/methods", methods);
router.post("/payment", create);
export default router;