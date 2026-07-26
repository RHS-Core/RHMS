import { getServices, createService } from "./hotelServiceService.js";
import { validateCreateService } from "./hotelServiceValidator.js";

export const getAll = async (req, res, next) => {
    try {
        const result = await getServices();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const create = async (req, res, next) => {
    try {
        const { isValid, errors } = validateCreateService(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors,
            });
        }
        const result = await createService(req.body);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    getAll,
    create,
};