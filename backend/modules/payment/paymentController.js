import { validateCreatePayment } from "./paymentValidator.js";
import { createPayment } from "./paymentService.js";

export const create = async (req, res, next) => {
    try {
        const { isValid, errors } = validateCreatePayment(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors,
            });
        }
        const result = await createPayment(req.body);
        return res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};

export default {
    create,
};