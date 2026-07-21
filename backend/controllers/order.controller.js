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

export const createOrderHandler = async (req, res, next) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await createOrder({
      userId: req.user?.id || null,
      tableId: value.tableId,
      items: value.items,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const result = await getAllOrders(req.query);
    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderHandler = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await updateOrderStatus(req.params.id, value.status);
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateOrderItemsHandler = async (req, res, next) => {
  try {
    const { error, value } = updateOrderItemsSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    const order = await updateOrderItems(req.params.id, value.items);
    return res.status(200).json({
      success: true,
      message: 'Order items updated successfully',
      data: order,
    });
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
