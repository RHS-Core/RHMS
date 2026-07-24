import Joi from 'joi';

const itemSchema = Joi.object({
  foodId: Joi.number().integer().positive().required().messages({
    'number.base': 'Food ID must be a number.',
    'number.integer': 'Food ID must be an integer.',
    'number.positive': 'Food ID must be greater than 0.',
    'any.required': 'Food ID is required.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.min': 'Quantity must be at least 1.',
    'any.required': 'Quantity is required.',
  }),
});

const updateItemSchema = Joi.object({
  foodId: Joi.number().integer().positive().required().messages({
    'number.base': 'Food ID must be a number.',
    'number.integer': 'Food ID must be an integer.',
    'number.positive': 'Food ID must be greater than 0.',
    'any.required': 'Food ID is required.',
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.min': 'Quantity must be 0 or greater.',
    'any.required': 'Quantity is required.',
  }),
});

export const createOrderSchema = Joi.object({
  tableId: Joi.number().integer().positive().required().messages({
    'number.base': 'Table ID must be a number.',
    'number.integer': 'Table ID must be an integer.',
    'number.positive': 'Table ID must be greater than 0.',
    'any.required': 'Table ID is required.',
  }),
  items: Joi.array().items(itemSchema).min(1).required().messages({
    'array.min': 'At least one item is required.',
    'any.required': 'Items are required.',
  }),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PREPARING', 'SERVED', 'COMPLETED', 'CANCELLED').required().messages({
    'any.only': 'Status must be one of PENDING, PREPARING, SERVED, COMPLETED, CANCELLED.',
    'any.required': 'Status is required.',
  }),
});

export const updateOrderItemsSchema = Joi.object({
  items: Joi.array().items(updateItemSchema).min(1).required().messages({
    'array.min': 'At least one item is required.',
    'any.required': 'Items are required.',
  }),
});

export default { createOrderSchema, updateOrderStatusSchema, updateOrderItemsSchema };
