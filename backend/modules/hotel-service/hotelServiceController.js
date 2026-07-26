import { getServices } from "./hotelServiceService.js";

export const getAll = async (req, res, next) => {
    try {
        const result = await getServices();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    getAll,
};