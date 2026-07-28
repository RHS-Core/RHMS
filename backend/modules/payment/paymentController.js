import { validateCreatePayment } from "./paymentValidator.js";
import {
    createPayment,
    getPaymentMethods,
    getPayments,
    updatePaymentStatus,
    getStaffRevenue,
    getHotelManagerRevenue,
    getRestaurantManagerRevenue,
    getAdminRevenue,
} from "./paymentService.js";
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

export const methods = async (req, res, next) => {
    try {
        const result = await getPaymentMethods();
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const result = await getPayments();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await updatePaymentStatus(id, status);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const staffRevenue = async (req, res, next) => {
    try {
        const { staffId } = req.params;

        const result = await getStaffRevenue(staffId);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const hotelManagerRevenue = async (req, res, next) => {
    try {
        const result = await getHotelManagerRevenue();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const restaurantManagerRevenue = async (req, res, next) => {
    try {
        const result = await getRestaurantManagerRevenue();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const adminRevenue = async (req, res, next) => {
    try {
        const result = await getAdminRevenue();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    create,
    methods,
    getAll,
    updateStatus,
    staffRevenue,
    hotelManagerRevenue,
    restaurantManagerRevenue,
    adminRevenue,
};