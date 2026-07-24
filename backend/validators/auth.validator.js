import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
  }),
  username: Joi.string().trim().min(3).max(100).allow('', null).messages({
    'string.min': 'Username must be at least 3 characters long.',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().trim().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
  role: Joi.string().valid('Customer').optional().default('Customer'),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Email or username is required.',
    'any.required': 'Email or username is required.',
    'string.min': 'Email or username must be at least 3 characters long.',
  }),
  password: Joi.string().trim().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
});

export default { registerSchema, loginSchema };
