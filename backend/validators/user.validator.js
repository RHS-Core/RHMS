import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Họ tên là bắt buộc.',
    'string.min': 'Họ tên phải có ít nhất 2 ký tự.',
  }),
  username: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Username là bắt buộc.',
    'string.min': 'Username phải có ít nhất 3 ký tự.',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email là bắt buộc.',
    'string.email': 'Email không hợp lệ.',
  }),
  password: Joi.string().trim().min(8).required().messages({
    'string.empty': 'Mật khẩu là bắt buộc.',
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự.',
  }),
  role: Joi.string().valid('Customer', 'RestaurantStaff', 'HotelStaff', 'RestaurantManager', 'HotelManager', 'SuperAdmin').required().messages({
    'any.only': 'Role không hợp lệ.',
    'any.required': 'Role là bắt buộc.',
  }),
});

export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required().messages({
    'any.only': 'Status phải là ACTIVE hoặc INACTIVE.',
    'any.required': 'Status là bắt buộc.',
  }),
});

export default { createUserSchema, updateUserStatusSchema };
