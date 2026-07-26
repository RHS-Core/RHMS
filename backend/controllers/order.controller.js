import {
  createOrderSchema,
  updateOrderStatusSchema,
  updateOrderItemsSchema,
} from '../validators/order.validator.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderItems,
  updateOrderStatus,
} from '../services/order.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createOrderHandler = async (req, res, next) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const order = await createOrder({
      userId: req.user?.id || null,
      tableId: value.tableId,
      items: value.items,
      status: value.status || 'PENDING',
      paymentStatus: value.paymentStatus,
      hotelBookingId: value.hotelBookingId,
      roomNumber: value.roomNumber,
    });

    return successResponse(res, 201, 'Order created successfully', order);
  } catch (error) {
    return next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const result = await getAllOrders(req.query);
    return successResponse(res, 200, 'Orders fetched successfully', result);
  } catch (error) {
    return next(error);
  }
};

export const getOrderHandler = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    return successResponse(res, 200, 'Order fetched successfully', order);
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const order = await updateOrderStatus(req.params.id, value.status);
    return successResponse(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    return next(error);
  }
};

export const updateOrderItemsHandler = async (req, res, next) => {
  try {
    const { error, value } = updateOrderItemsSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, 400, 'Validation failed');
    }

    const order = await updateOrderItems(req.params.id, value.items);
    return successResponse(res, 200, 'Order items updated successfully', order);
  } catch (error) {
    return next(error);
  }
};

export default {
  createOrderHandler,
  listOrders,
  getOrderHandler,
  updateOrderStatusHandler,
  updateOrderItemsHandler,
};
