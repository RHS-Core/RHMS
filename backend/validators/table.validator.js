import Joi from 'joi';

const tableNumberSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'Table number must be a number.',
  'number.integer': 'Table number must be an integer.',
  'number.positive': 'Table number must be greater than 0.',
  'any.required': 'Table number is required.',
});

export const createTableSchema = Joi.object({
  tableNumber: tableNumberSchema,
  capacity: Joi.number().integer().positive().required().messages({
    'number.base': 'Capacity must be a number.',
    'number.integer': 'Capacity must be an integer.',
    'number.positive': 'Capacity must be greater than 0.',
    'any.required': 'Capacity is required.',
  }),
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING').optional().default('AVAILABLE'),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING').required().messages({
    'any.only': 'Status must be one of AVAILABLE, RESERVED, OCCUPIED, CLEANING.',
    'any.required': 'Status is required.',
  }),
});

export default { createTableSchema, updateStatusSchema };
