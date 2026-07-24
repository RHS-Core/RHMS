import Joi from 'joi';

const createFoodSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
    'string.max': 'Name must not exceed 100 characters.',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
    'any.required': 'Price is required.',
  }),
  category: Joi.string().trim().required().messages({
    'string.empty': 'Category is required.',
    'any.required': 'Category is required.',
  }),
  description: Joi.string().trim().allow('').optional(),
  status: Joi.string().valid('AVAILABLE', 'OUT_OF_STOCK').optional(),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('').optional(),
  status: Joi.string().valid('AVAILABLE', 'OUT_OF_STOCK').optional(),
});

export { createFoodSchema, updateFoodSchema };
export default { createFoodSchema, updateFoodSchema };
