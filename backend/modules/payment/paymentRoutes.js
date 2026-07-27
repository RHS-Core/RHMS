import { Router } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import { create, methods, getAll, updateStatus, staffRevenue, managerRevenue, adminRevenue} from "./paymentController.js";

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
router.get("/payment/revenue/staff/:staffId", staffRevenue);
router.get("/payment/revenue/manager", managerRevenue);
router.get("/payment/revenue/admin", adminRevenue);

export default router;