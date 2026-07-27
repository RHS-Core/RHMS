import { Router } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import { create, methods, getAll, updateStatus, } from "./paymentController.js";

const router = Router();

router.get("/payment/health", (req, res) => {
    return successResponse(res, 200, "Payment module is healthy", {
        module: "payment",
        status: "ok",
    });
});

router.post("/payment", create);
router.get("/payment/methods", methods);
router.get("/payment", getAll);
router.patch("/payment/:id/status", updateStatus);

export default router;